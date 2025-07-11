import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { extractFields } from '@shared/utils';

const sampleData = `[{"children":[{"text":"Alan Mathison Turing (/ˈtjʊərɪŋ/; 23 June 1912 – 7 June 1954) was an English mathematician, computer scientist, logician, cryptanalyst, philosopher and theoretical biologist.[5] He was highly influential in the development of theoretical computer science, providing a formalisation of the concepts of algorithm and computation with the Turing machine, which can be considered a model of a general-purpose computer.[6][7][8] Turing is widely considered to be the father of theoretical computer science.[9]"}],"type":"p","id":"i2rpBtCPze"},{"children":[{"text":"Born in London, Turing was raised in southern England. He graduated from King's College, Cambridge, and in 1938, earned a doctorate degree from Princeton University. During World War II, Turing worked for the Government Code and Cypher School at Bletchley Park, Britain's codebreaking centre that produced Ultra intelligence. He led Hut 8, the section responsible for German naval cryptanalysis. Turing devised techniques for speeding the breaking of German ciphers, including improvements to the pre-war Polish bomba method, an electromechanical machine that could find settings for the Enigma machine. He played a crucial role in cracking intercepted messages that enabled the Allies to defeat the Axis powers in many engagements, including the Battle of the Atlantic.[10][11]"}],"type":"p","id":"maKXO_CHal"},{"children":[{"text":"After the war, Turing worked at the National Physical Laboratory, where he designed the Automatic Computing Engine, one of the first designs for a stored-program computer. In 1948, Turing joined Max Newman's Computing Machine Laboratory at the University of Manchester, where he contributed to the development of early Manchester computers[12] and became interested in mathematical biology. Turing wrote on the chemical basis of morphogenesis[13][1] and predicted oscillating chemical reactions such as the Belousov–Zhabotinsky reaction, first observed in the 1960s. Despite these accomplishments, he was never fully recognised during his lifetime because much of his work was covered by the Official Secrets Act.[14]"}],"type":"p","id":"e22rpg3ewU"},{"children":[{"text":"In 1952, Turing was prosecuted for homosexual acts. He accepted hormone treatment, a procedure commonly referred to as chemical castration, as an alternative to prison. Turing died on 7 June 1954, aged 41, from cyanide poisoning. An inquest determined his death as suicide, but the evidence is also consistent with accidental poisoning.[15] Following a campaign in 2009, British prime minister Gordon Brown made an official public apology for \\"the appalling way [Turing] was treated\\". Queen Elizabeth II granted a pardon in 2013. The term \\"Alan Turing law\\" is used informally to refer to a 2017 law in the UK that retroactively pardoned men cautioned or convicted under historical legislation that outlawed homosexual acts.[16]"}],"type":"p","id":"xf7cbpwD--"},{"children":[{"text":"Turing left an extensive legacy in mathematics and computing which has become widely recognised with statues and many things named after him, including an annual award for computing innovation. His portrait appears on the Bank of England £50 note, first released on 23 June 2021 to coincide with his birthday. The audience vote in a 2019 BBC series named Turing the greatest person of the 20th century."}],"type":"p","id":"_r4ZA1mD4M"}]`;

@Injectable()
export class DocumentsSeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    // Find or create a collection to add the document to
    let collection = await this.prisma.collection.findFirst({
      include: {
        users: true,
      },
    });

    if (!collection) {
      // Create a default collection if none exists
      const firstUser = await this.prisma.user.findFirst();
      if (!firstUser) {
        throw new Error('No users found. Please run the users seeder first.');
      }

      collection = await this.prisma.collection.create({
        data: {
          name: 'Sample Collection',
          description: 'A collection with sample documents',
          users: {
            create: {
              userId: firstUser.id,
              role: 'owner',
            },
          },
        },
        include: {
          users: true,
        },
      });
    }

    // Use the first owner of the collection as the author
    const collectionOwner = collection.users.find(user => user.role === 'owner');
    const authorId = collectionOwner?.userId || collection.users[0]?.userId;

    if (!authorId) {
      throw new Error('No valid author found for the collection.');
    }

    // Check if a document with this title already exists to avoid duplicates
    const existingDocument = await this.prisma.document.findFirst({
      where: {
        title: 'Father of Computer Science',
        collectionId: collection.id,
      },
    });

    if (existingDocument) {
      console.log('Document already exists, skipping creation');
      return existingDocument;
    }

    return this.prisma.document.create({
      data: {
        collectionId: collection.id,
        title: 'Father of Computer Science',
        content: sampleData,
        plainContent: extractFields(JSON.parse(sampleData), 'text'),
        authorId,
      },
    });
  }
}
