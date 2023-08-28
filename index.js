const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
  const key = event.Records[0].s3.object
  try{
    
    let response = await imagesJsonExists();
    let body = JSON.parse(decodeURIComponent(response.body.Body)) //array
    console.log('body', typeof body, body)// why is this undefined
    console.log('found images.json!  doing stuff now');
    
    // is the uploaded image name already in the arr?
    let duplicateImage = body.find(obj => {
      return obj.key === key.key
    });
    
    if(duplicateImage){duplicateImage = key}
    else{body.push(key)}
    
    let params = {
    Bucket: '401n23rpruazol',
    Key: 'images.json',
    Body: JSON.stringify(body)
  }
    await S3.putObject(params).promise();
    console.log('updated images.json')
    
  }catch(e){
    console.log('ERROR>>>', e)
    const data = [key];
    let params = {
    Bucket: '401n23rpruazol',
    Key: 'images.json',
    Body: JSON.stringify(data)
  }
    await S3.putObject(params).promise();
    console.log('not found.  uploaded images.json file')
  }
};


const imagesJsonExists = async () => {
    let params = {
    Bucket: '401n23rpruazol',
    Key: 'images.json',
  }
  
    const data = await S3.getObject(params).promise();
    if(data){  
      const response = {
      statusCode: 200,
      body: data
      }
    return response
  }
}