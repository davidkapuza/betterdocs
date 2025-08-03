import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '@shared/libs/prisma';
import {
  CreateCollectionInput,
  QueryCollectionInput,
  UpdateCollectionInput,
  DeleteCollectionInput,
  InviteUserToCollectionInput,
  AcceptCollectionInviteInput,
  RemoveUserFromCollectionInput,
  GenerateCollectionShareLinkInput,
} from './gql';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailService } from '@modules/mail/mail.service';
import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

const COLLECTIONS_QUEUE_INPUT =
  process.env.COLLECTIONS_QUEUE_INPUT || 'collections_queue.input';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(COLLECTIONS_QUEUE_INPUT)
    private readonly documentsQueue: ClientProxy,
    private readonly configService: ConfigService<Config>,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async getUserCollections(userId: number) {
    const col = await this.prisma.collection.findMany({
      where: { users: { some: { userId } } },
    });
    return col;
  }

  async getCollection(collectionId: number) {
    const col = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });
    return col;
  }

  async createCollection(
    userId: number,
    createCollectionInput: CreateCollectionInput
  ) {
    return this.prisma.collection.create({
      data: {
        name: createCollectionInput.name,
        description: createCollectionInput.description,
        users: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
  }

  async updateCollection(updateCollectionInput: UpdateCollectionInput) {
    const updateData: { name?: string; description?: string } = {};

    if (updateCollectionInput.name !== undefined) {
      updateData.name = updateCollectionInput.name;
    }

    if (updateCollectionInput.description !== undefined) {
      updateData.description = updateCollectionInput.description;
    }

    return this.prisma.collection.update({
      where: { id: updateCollectionInput.collectionId },
      data: updateData,
    });
  }

  async deleteCollection(deleteCollectionInput: DeleteCollectionInput) {
    // First, delete all documents in the collection
    await this.prisma.document.deleteMany({
      where: { collectionId: deleteCollectionInput.collectionId },
    });

    // Then delete all user-collection relationships
    await this.prisma.userCollection.deleteMany({
      where: { collectionId: deleteCollectionInput.collectionId },
    });

    // Finally, delete the collection itself
    return this.prisma.collection.delete({
      where: { id: deleteCollectionInput.collectionId },
    });
  }

  async queryCollection(
    queryCollectionInput: QueryCollectionInput & { userId: number }
  ) {
    this.documentsQueue.emit(
      this.configService.get('rmq.requestPattern', { infer: true }),
      queryCollectionInput
    );
  }

  async inviteUserToCollection(
    userId: number,
    inviteInput: InviteUserToCollectionInput
  ) {
    // Check if user has permission to invite (owner or editor)
    const userCollection = await this.prisma.userCollection.findUnique({
      where: {
        userId_collectionId: {
          userId,
          collectionId: inviteInput.collectionId,
        },
      },
    });

    if (!userCollection || userCollection.role === 'viewer') {
      throw new Error(
        'You do not have permission to invite users to this collection'
      );
    }

    // Check if user is already a member
    const existingUser = await this.usersService.findByEmail(inviteInput.email);
    if (existingUser) {
      const existingMember = await this.prisma.userCollection.findUnique({
        where: {
          userId_collectionId: {
            userId: existingUser.id,
            collectionId: inviteInput.collectionId,
          },
        },
      });

      if (existingMember) {
        throw new Error('User is already a member of this collection');
      }
    }

    // Create JWT token for invite
    const inviter = await this.usersService.findById(userId);
    const collection = await this.getCollection(inviteInput.collectionId);

    const payload = {
      type: 'invite',
      collectionId: inviteInput.collectionId,
      inviterEmail: inviter.email,
      inviteeEmail: inviteInput.email,
      role: inviteInput.role,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Send invitation email
    await this.mailService.sendCollectionInvitation({
      to: inviteInput.email,
      data: {
        inviterName: `${inviter.firstName} ${inviter.lastName}`,
        collectionName: collection.name,
        inviteToken: token,
        frontendUrl: this.configService.get('app.frontendDomain', {
          infer: true,
        }),
      },
    });

    // Return a mock invite object for compatibility
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return {
      id: token,
      collectionId: inviteInput.collectionId,
      inviterEmail: inviter.email,
      inviteeEmail: inviteInput.email,
      role: inviteInput.role,
      token,
      expiresAt,
      acceptedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      collection,
    };
  }

  async acceptCollectionInvite(
    userId: number,
    acceptInput: AcceptCollectionInviteInput
  ) {
    try {
      // Verify and decode JWT token
      const payload = this.jwtService.verify(acceptInput.inviteToken);

      // Validate token type and structure
      if (
        payload.type !== 'invite' ||
        !payload.collectionId ||
        !payload.role ||
        !payload.inviteeEmail
      ) {
        throw new Error('Invalid invitation token structure');
      }

      const { collectionId, role, inviteeEmail } = payload;

      const user = await this.usersService.findById(userId);
      if (user.email !== inviteeEmail) {
        throw new Error('This invitation is not for your email address');
      }

      // Verify collection exists
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Check if user is already a member
      const existingMember = await this.prisma.userCollection.findUnique({
        where: {
          userId_collectionId: {
            userId,
            collectionId,
          },
        },
      });

      if (existingMember) {
        throw new Error('You are already a member of this collection');
      }

      // Add user to collection
      await this.prisma.userCollection.create({
        data: {
          userId,
          collectionId,
          role,
        },
      });

      return collection;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Invitation has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid invitation token');
      }
      throw error;
    }
  }

  async generateCollectionShareLink(
    userId: number,
    shareLinkInput: GenerateCollectionShareLinkInput
  ) {
    console.log('generateCollectionShareLink called with:', {
      userId,
      shareLinkInput,
    });

    // Check if user has permission to create share links (owner or editor)
    const userCollection = await this.prisma.userCollection.findUnique({
      where: {
        userId_collectionId: {
          userId,
          collectionId: shareLinkInput.collectionId,
        },
      },
    });

    console.log('userCollection found:', userCollection);

    if (!userCollection || userCollection.role === 'viewer') {
      throw new Error(
        'You do not have permission to create share links for this collection'
      );
    }

    // Create JWT payload
    const payload = {
      type: 'share_link',
      collectionId: shareLinkInput.collectionId,
      role: shareLinkInput.role,
    };

    // Set expiration
    let expiresIn = '30d'; // Default 30 days
    if (shareLinkInput.expiresInDays && shareLinkInput.expiresInDays > 0) {
      expiresIn = `${shareLinkInput.expiresInDays}d`;
    }

    console.log(
      'Creating JWT token with payload:',
      payload,
      'expiresIn:',
      expiresIn
    );

    // Generate JWT token
    const token = this.jwtService.sign(payload, { expiresIn });

    console.log('JWT token created');

    const frontendUrl = this.configService.get('app.frontendDomain', {
      infer: true,
    });
    const url = `${frontendUrl}/collections/join/${token}`;

    // Calculate actual expiration date for display
    let expiresAt: Date | null = null;
    if (shareLinkInput.expiresInDays && shareLinkInput.expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + shareLinkInput.expiresInDays);
    } else {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Default 30 days
    }

    const result = {
      url,
      token,
      role: shareLinkInput.role,
      expiresAt,
    };

    console.log('Returning share link result:', result);

    return result;
  }

  async joinCollectionByShareLink(userId: number, token: string) {
    try {
      // Verify and decode JWT token
      const payload = this.jwtService.verify(token);

      // Validate token type and structure
      if (!payload.type || !payload.collectionId || !payload.role) {
        throw new Error('Invalid token structure');
      }

      const { collectionId, role, type } = payload;

      // For invite tokens, validate the invitee email
      if (type === 'invite') {
        const user = await this.usersService.findById(userId);
        if (user.email !== payload.inviteeEmail) {
          throw new Error('This invitation is not for your email address');
        }
      }

      // Verify collection exists
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Check if user is already a member
      const existingMember = await this.prisma.userCollection.findUnique({
        where: {
          userId_collectionId: {
            userId,
            collectionId,
          },
        },
      });

      if (existingMember) {
        throw new Error('You are already a member of this collection');
      }

      // Add user to collection
      await this.prisma.userCollection.create({
        data: {
          userId,
          collectionId,
          role,
        },
      });

      return collection;
    } catch (error) {
      console.log('JWT verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        throw new Error('Link has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid link');
      }
      throw error;
    }
  }

  async removeUserFromCollection(
    userId: number,
    removeInput: RemoveUserFromCollectionInput
  ) {
    // Check if user has permission to remove members (owner only)
    const userCollection = await this.prisma.userCollection.findUnique({
      where: {
        userId_collectionId: {
          userId,
          collectionId: removeInput.collectionId,
        },
      },
    });

    if (!userCollection || userCollection.role !== 'owner') {
      throw new Error(
        'You do not have permission to remove users from this collection'
      );
    }

    // Cannot remove yourself if you're the only owner
    if (removeInput.userId === userId) {
      const ownerCount = await this.prisma.userCollection.count({
        where: {
          collectionId: removeInput.collectionId,
          role: 'owner',
        },
      });

      if (ownerCount === 1) {
        throw new Error('Cannot remove the last owner from the collection');
      }
    }

    // Remove user from collection
    const removedMember = await this.prisma.userCollection.delete({
      where: {
        userId_collectionId: {
          userId: removeInput.userId,
          collectionId: removeInput.collectionId,
        },
      },
      include: {
        user: true,
        collection: true,
      },
    });

    return removedMember;
  }

  async getCollectionMembers(collectionId: number) {
    return this.prisma.userCollection.findMany({
      where: {
        collectionId,
      },
      include: {
        user: true,
      },
      orderBy: [
        { role: 'asc' }, // owners first
        { createdAt: 'asc' },
      ],
    });
  }

  async getPendingInvites(_collectionId: number) {
    // Since we're using JWT tokens, we don't store invites in the database
    // Return empty array - pending invites are tracked via email only
    return [];
  }

  async getCollectionShareLinks(_collectionId: number) {
    // Since we're using JWT tokens, we don't store share links in the database
    // Return empty array for now, or we could implement a different approach
    // to track active share links if needed
    return [];
  }

  async deleteShareLink(_userId: number, _shareLinkId: string) {
    // Since JWT tokens are stateless, we can't "delete" them
    // They will expire naturally based on their expiration time
    // For immediate revocation, we would need to implement a blacklist
    throw new Error(
      'JWT-based share links cannot be deleted. They expire automatically.'
    );
  }
}
