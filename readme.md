Task Tracker is an extensible repo, utilizing Node.JS that is designed to record submissions made to a specific Koii task (or multiple tasks)

Practical Use Cases:

- Recording IPFS hashes to a specific task
- Statistics on submissions made to a specific task
- Rewarding your community for submitting to a specific task outside of the Koii Ecosystem

By default, it is configured to record all the whitelisted tasks on the Koii Network. You can change this behavior by disabling
the following cron operation:

```
    cron.schedule("0 */15 * * * *", () => {
      console.log("Scheduled run to fetch active whitelisted tasks.");
      this.getTasksToTrack();
    });
```

And providing a hardcoded task ID value within

```
this.tasksToTrack = [];
```

## Configuration

DB_URI_USER: Your MongoDB URI
URL_K2: K2's URL (https://testnet.koii.live)

## Usage

yarn install
node index.js

![Task Tracker](https://i.imgur.com/W8JdHEG.jpeg)
