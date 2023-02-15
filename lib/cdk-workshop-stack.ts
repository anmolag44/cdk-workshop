import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define an AWS lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X, // this is the execution environment
      code: lambda.Code.fromAsset('lambda'), // this the code loaded from "lambda" directory
      handler: 'hello.handler' // here, file is hello & function is handler
    });
  }
}