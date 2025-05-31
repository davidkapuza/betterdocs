export type RabbitMQConfig = {
  uri: string;
  collectionQueueInput: string;
  collectionQueueOutput: string;
  responsePattern: string;
  requestPattern: string;
};
