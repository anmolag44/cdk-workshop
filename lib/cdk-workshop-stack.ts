import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter-construct';
import {TableViewer} from 'cdk-dynamo-table-viewer';
export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define an AWS Lambda as a resource
    const hello = new lambda.Function(this, 'HelloHandler',{
      runtime: lambda.Runtime.NODEJS_16_X, // this is the execution environment
      code: lambda.Code.fromAsset('lambda'), // this is the code to be loaded from "lambda" directory
      handler: 'hello.handler' // file is "hello" & function is "handler"
    });

    // HitCounter 
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello // passing this hello lambda in the downstream to hitcounter
    });

    // defines API Gateway rest api resources backed by 'hello' function
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler    // here we assign the hitcounter so it will hit the hitcounter lambda and then the inturn hit the hello lambda
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits', 
      table: helloWithCounter.table,
      sortBy: '-hits'
    });
  }
}