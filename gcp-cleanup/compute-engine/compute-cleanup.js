const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Function to Get the List of all Running Instances into a Javascript Object
const listInstances = async () => {
  // Getting List of all Running Instances in the project
  const { stdout, stderr } = await exec(
    'gcloud compute instances list --format="json(name,zone.basename())" --filter="status=RUNNING"'
  );

  // Parsing JSON data
  instances = JSON.parse(stdout);
  if (instances.length > 0) {
    instanceCleanup(instances);
  } else {
    console.log("No Instances Found");
  }
};

// Function to Delete All Instances which have been running for more than 24 hours.
const instanceCleanup = async (instances) => {
  instances.forEach(async (instance) => {
    // Fetching Instance Details
    const { stdout, stderr } = await exec(
      `gcloud compute instances describe ${instance.name} --zone=${instance.zone} --format="json(name,lastStartTimestamp)"`
    );
    const instanceDetails = JSON.parse(stdout);

    // Calulating Hours since instance was last started.
    const currTime = new Date();
    const instanceStartTime = new Date(instanceDetails.lastStartTimestamp);
    const delta = currTime - instanceStartTime;
    const hoursRunning = Math.floor(delta / (60e3 * 60));
    console.log("hoursRunning: " + hoursRunning);

    // Deleting Instances which have been running longer than 24 hours.
    if (hoursRunning >= 24) {
      await exec(
        `gcloud compute instances delete ${instance.name} --zone=${instance.zone} --quiet`
      );
      console.log(`${instance.name} Deleted`);
    } else {
      console.log("Instance Lifetime not exceeded");
    }
  });
};
listInstances();
