import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define an AWS Lambda as a resource
    const hello = new lambda.Function(this, 'HelloHandler',{
      runtime: lambda.Runtime.NODEJS_16_X, // this is the execution environment
      code: lambda.Code.fromAsset('lambda'), // this is the code to be loaded from "lambda" directory
      handler: 'hello.handler' // file is "hello" & function is "handler"
    });
  }
}