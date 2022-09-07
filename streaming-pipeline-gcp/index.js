const { faker } = require("@faker-js/faker");
const { PubSub } = require("@google-cloud/pubsub");
const dotenv = require("dotenv");

const values = dotenv.config();

const generateData = () => {
  const account = faker.finance.account(8);
  const accountName = faker.finance.accountName();
  const amount = faker.finance.amount(5, 1000, 2, "$");
  const creditCardNumber = faker.finance.creditCardNumber();
  const currencyCode = faker.finance.currencyCode();
  const pin = faker.finance.pin();
  const transactionType = faker.finance.transactionType();

  const data = JSON.stringify({
    account: account,
    accountName: accountName,
    amount: amount,
    creditCardNumber: creditCardNumber,
    currencyCode: currencyCode,
    pin: pin,
    transactionType: transactionType,
  });
  return data;
};

const publishMessage = async () => {
  const topicName = process.env.TOPIC_NAME;
  const projectId = process.env.PROJECT_ID;

  const pubsubClient = new PubSub({ projectId });
  for (i = 0; i < 10000; i++) {
    const data = generateData();
    const dataBuffer = Buffer.from(data);

    try {
      const messageId = await pubsubClient.topic(topicName).publish(dataBuffer);
      console.log(`Message ID ${messageId} published`);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }
};
publishMessage();
