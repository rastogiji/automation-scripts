const util = require("util");
const exec = util.promisify(require("child_process").exec);
const uuid = require("uuid");

const diskDelete = async () => {
  // Get a List of all the disks present.
  const { stdout, stderr } = await exec(
    `gcloud compute disks list --format="json(name,lastAttachTimestamp,zone.basename())"`
  );

  // Parsing JSON response
  const disks = await JSON.parse(stdout);

  if (disks.length > 0) {
    diskCleanup(disks);
  } else {
    console.log("No Disks Detected");
  }
};

// Creates Snopshot of all unattached Disks and Deletes them.
const diskCleanup = async (disks) => {
  disks.forEach(async (disk) => {
    if (disk.lastAttachTimestamp === undefined) {
      console.log(`${disk.name} is Unattached. Snapshotting...`);
      await exec(
        `gcloud compute disks snapshot ${disk.name} \
        --zone=${disk.zone} --snapshot-names=${disk.name}-snapshot-${uuid.v4()}`
      );

      console.log("Successfully created the snapshot");
      console.log("Deleting...");

      await exec(
        `gcloud compute disks delete ${disk.name} --zone=${disk.zone} --quiet`
      );
      console.log("Disk Successfully Deleted");
    }
  });
};

module.exports = diskDelete;
