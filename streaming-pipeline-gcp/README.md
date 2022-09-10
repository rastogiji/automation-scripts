# Sample Streaming Data Pipeline on GCP

This Repository contains sample Nodejs code which generates Fake Transaction Data and pushes the message to a Cloud Pub/Sub Topic.

From there, you can send it to any Downstream service like DBs, Data Warehouse, Data Lake, etc. In this example, we'll use a one of the default template provided by Dataflow **Pub/Sub Subscription to BigQuery**.

**Note:** Now, you don't need to use Dataflow. You can directly configure a BigQuery table as a sink in your Pub/Sub Subscription.
