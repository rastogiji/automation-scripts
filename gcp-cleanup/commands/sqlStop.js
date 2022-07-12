const util = require("util");
const exec = util.promisify(require("child_process").exec);

const sqlStop = async () => {
  const { stdout, stderr } = await exec(
    `gcloud sql instances list --format="json(name,gceZone,state)" --filter="state=RUNNABLE"`
  );

  const instances = JSON.parse(stdout);
  sqlCleanup(instances);
};

const sqlCleanup = (instances) => {
  instances.forEach(async (instance) => {
    console.log(`Stopping Instance ${instance.name}...`);
    await exec(
      `gcloud sql instances patch ${instance.name} --activation-policy=NEVER`
    );
    console.log(`Instance Stopped`);
  });
};

module.exports = sqlStop;
