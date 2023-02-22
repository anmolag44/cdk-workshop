import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';

export interface HitCounterProps {
    /* ... the function for which we want to count url hits ... */
    downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
    // allowing access to the counter function **
    public readonly handler: lambda.Function; 

    // Allowing the table to be exposed 
    public readonly table: cdk.aws_dynamodb.Table;

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
        this.table = table;

        // granting the lambda read write permissions to the table
        table.grantReadWriteData(this.handler);

        // grant the lambda role invoke permissions to the downstream function
        props.downstream.grantInvoke(this.handler);
    }
}