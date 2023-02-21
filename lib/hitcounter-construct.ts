import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Lambda } from 'aws-cdk-lib/aws-ses-actions';
import {Construct} from 'constructs';

export interface HitCounterProps {
    /* ... the function for which we want to count url hits ... */
    downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
    // allowing access to the counter function **
    public readonly handler: lambda.Function; 

    constructor(scope: Construct, id: string, props: HitCounterProps){
        super(scope, id);
    
        const table = new cdk.aws_dynamodb.Table(this, 'Hits', {
            partitionKey: {name: 'path', type: cdk.aws_dynamodb.AttributeType.STRING}  // creating a db resource with path as partition key 
        });

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,  
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hitcounter.handler',  // giving handler from lambda hitcounter.js
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName
            }
        });
    }
}