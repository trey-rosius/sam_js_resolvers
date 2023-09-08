API_URL="https://vuamteij4fezzkvop5d3furvlq.appsync-api.us-east-2.amazonaws.com/graphql"
API_KEY="da2-mfjkd2tezzamppchgohq6sakw4"
echo $API
jq -ncM '{method: "POST", url: "https://vuamteij4fezzkvop5d3furvlq.appsync-api.us-east-2.amazonaws.com/graphql", body: {query: "mutation create { createPost(postInput:{content: \"this is the lambda function content\", imageUrl:\"rosius.jpg\",userId:\"test@gmail.com\"}) { content
id
imageUrl
userId } }"} | @base64, header: {"content-type": ["application/json"], "x-api-key": ["da2-mfjkd2tezzamppchgohq6sakw4"]}}' | vegeta attack -format=json -duration=60s | tee report.bin | vegeta report

### Lambda function

```
Requests      [total, rate, throughput]
              3000,   50.02, 49.54
Duration      [total, attack, wait]
              1m1s,  59.976s, 580.484ms
Latencies     [min,      mean,      50,        90,        95,      99,    max]
              301.284ms, 663.146ms, 513.768ms, 764.986ms, 2.276s, 4.051s, 4.869s
Bytes In      [total, mean]
               441474, 147.16
Bytes Out     [total, mean]
               627000, 209.00
Success       [ratio]                           100.00%
Status Codes  [code:count]                      200:3000
Error Set:

```

### Javascript Resolvers

```
Requests      [total, rate, throughput]
               3000,  50.02, 49.81
Duration      [total, attack,  wait]
               1m0s,  59.978s, 249.125ms
Latencies     [min,      mean,      50,        90,        95,        99,         max]
              216.848ms, 269.277ms, 250.105ms, 312.029ms, 337.313ms, 706.843ms, 1.342s
Bytes In      [total, mean]
              474000, 158.00
Bytes Out     [total,  mean]
               567000, 189.00
Success       [ratio]                           100.00%
Status Codes  [code:count]                      200:3000
Error Set:

```
