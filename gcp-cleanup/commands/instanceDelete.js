const util = require("util");
const exec = util.promisify(require("child_process").exec);

const instanceDelete = async (options) => {
  const hourThreshold = options.hour !== undefined ? options.hour : 24;
  // Getting List of all Running Instances in the project
  const { stdout, stderr } = await exec(
    'gcloud compute instances list --format="json(name,zone.basename())" --filter="status=RUNNING"'
  );

  // Parsing JSON data
  instances = JSON.parse(stdout);
  if (instances.length > 0) {
    instanceCleanup(instances, hourThreshold);
  } else {
    console.log("No Instances Found");
  }
};

const instanceCleanup = async (instances, hourThreshold) => {
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
    if (hoursRunning >= hourThreshold) {
      await exec(
        `gcloud compute instances delete ${instance.name} --zone=${instance.zone} --quiet`
      );
      console.log(`${instance.name} Deleted`);
    } else {
      console.log("Instance Lifetime not exceeded");
    }
  });
};

module.exports = instanceDelete;
