const util = require("util");
const exec = util.promisify(require("child_process").exec);

const addressDelete = async () => {
  // Get the list of Unused external IP addresses.
  const { stdout, stderr } = await exec(
    `gcloud compute addresses list --format="json(name,region.basename())" --filter="addressType=EXTERNAL AND status=RESERVED"`
  );

  // Parsing JSON response
  const addresses = await JSON.parse(stdout);
  if (addresses.length > 0) {
    addressCleanup(addresses);
  } else {
    console.log("No External Unused IP address found");
  }
};

const addressCleanup = (addresses) => {
  addresses.forEach(async (address) => {
    console.log(`Releasing Static IP address ${address.name}...`);

    // Check if the Address is Global
    if (address.region === undefined) {
      await exec(
        `gcloud compute addresses delete ${address.name} --global --quiet`
      );
    } else {
      await exec(
        `gcloud compute addresses delete ${address.name} --region=${address.region} --quiet`
      );
    }
    console.log(`IP address Released`);
  });
};

module.exports = addressDelete;
