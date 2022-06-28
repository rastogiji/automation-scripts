const util = require("util");
const exec = util.promisify(require("child_process").exec);

const instanceDelete = async (options) => {
  const hourThreshold = options.hour !== undefined ? options.hour : 24;
  // Getting List of all Running Instances in the project
  const { stdout, stderr } = await exec(
    'gcloud compute instances list --format="json(name,zone.basename())" --filter="status=RUNNING"'
  );

  // Parsing JSON data
  instances = await JSON.parse(stdout);
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
    const instanceDetails = await JSON.parse(stdout);

    // Calulating Hours since instance was last started.
    const currTime = new Date();
    const instanceStartTime = new Date(instanceDetails.lastStartTimestamp);
    const delta = currTime - instanceStartTime;
    const hoursRunning = Math.floor(delta / (60e3 * 60));

    // Deleting Instances which have been running longer than the specified threshold.
    if (hoursRunning >= hourThreshold) {
      console.log(`Deleting ${instance.name}...`);
      await exec(
        `gcloud compute instances delete ${instance.name} --zone=${instance.zone} --quiet`
      );
      console.log(`${instance.name} Succssfully Deleted`);
    }
  });
};

module.exports = instanceDelete;
