import { createRouter, defineEventHandler, useBase } from 'h3'
import { Double, Int32, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
// @ts-ignore - Could not find a declaration file for module 'nodemailer'.
import nodemailer from 'nodemailer';

const router = createRouter();
const user = import.meta.env.VITE_USER;
const password = encodeURIComponent(`${import.meta.env.VITE_PASSWORD}`);
const remote = `mongodb+srv://${user}:${password}@developmentdb.g1e4gym.mongodb.net/?retryWrites=true&w=majority`;
const local = "mongodb://127.0.0.1:27017";
const client = new MongoClient(remote, { serverApi: ServerApiVersion.v1 });

(async () => {
  await client.connect().then(() => console.log("Connected to DB from Coupon.")).catch(err => console.log(err));
})();

const database: any = client.db(`${import.meta.env.VITE_DB}`);
const collection: any = database.collection(`${import.meta.env.VITE_COLLECTION_ONE}`);
const newUser: any = database.collection(`${import.meta.env.VITE_COLLECTION_TWO}`);

let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: import.meta.env.VITE_GMAIL_USER,
    pass: import.meta.env.VITE_GMAIL_PASS,
    clientId: import.meta.env.VITE_GMAIL_OAUTH_CLIENTID,
    clientSecret: import.meta.env.VITE_GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: import.meta.env.VITE_GMAIL_OAUTH_REFRESH_TOKEN
  }
});

router.get('/list', defineEventHandler(async (event) => {
  const search = collection.find({});
  const result = await search.toArray();
  return result;
}))

router.post('/create', defineEventHandler(async (event) => {
  const body = await readBody(event);

  await collection.insertOne({ 
    store: body.store,
    coupon_code: body.code,
    quantity: new Int32(body.quantity),
    store_image: body.logo,
    coupon_discount: new Double(body.discount),
    claimed: new Int32(0)
  });

  return {
    message: 'Cupon creado.',
    isSuccess: 'success'
  }
}));

router.post('/claim', defineEventHandler(async (event) => {
  const body = await readBody(event);
  const search = collection.find({ _id: new ObjectId(body.id) });
  const coupon = await search.toArray(); 

  const message = (coupon: any, user: any) => {
    return `
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .container {
            background: #1e90ff;
            border-radius: 12px;
            padding: 1.25rem;
            color: #ffffff;
          }

          .title {
            border-left: 0.5rem solid #ffffff;
            margin-bottom: 1rem;
            padding-left: 0.5rem
          }

          .text {
            border-right: 4px solid #ffffff;
            padding: 0.5rem 0 0.5rem 1rem;
          }
        </style>
      </head>

      <div class="container">
        <h1 class="title">Felicidades ${user.user} aqui esta tu cupon.</h1>
        <h3 class="text">Tienda: ${coupon.store}</h3>
        <h3 class="text">Codigo: ${coupon.coupon_code}</h3>
        <h3 class="text">Descuento: ${coupon.coupon_discount}$</h3>
      </div>
    `
  }

  let info = await transport.sendMail({
    from: "CouponApp 🎫 <noreply@couponapp.com>",
    to: `${body.email}`,
    subject: `Hola ${body.user}, recibiste un cupon.`,
    html: message(coupon[0], body),
  });

  await newUser.insertOne({ 
    username: body.user,
    email: body.email,
    phone_number: body.tel,
    coupon_id: body.id
  });

  await collection.updateOne({ _id: new ObjectId(body.id) }, { $inc: { claimed: 1 } });

  return {
    message: 'Cupon reclamado.',
    isSuccess: 'success'
  }
}));

router.post('/update', defineEventHandler(async (event) => {
  const body = await readBody(event);

  const search = collection.find({ _id: new ObjectId(body._id) })
  const coupon = await search.toArray();

  const updated = Object.keys(body).reduce((obj: any, value: any) => {
    if (body[value] != coupon[0][value]) {
      if (value == 'quantity') obj[value] = new Int32(body[value]);
      else if (value == 'coupon_discount') obj[value] = new Double(body[value]);
      else obj[value] = body[value];
    }
    return obj;
  }, {});

  await collection.updateOne({ _id: new ObjectId(body._id) }, { $set: updated });

  return {
    message: 'Cupon actualizado.',
    isSuccess: 'success'
  }
}));

router.post('/delete', defineEventHandler(async (event) => {
  const body = await readBody(event);
  await collection.deleteOne({ _id: new ObjectId(body.id) });

  return {
    message: 'Cupon borrado.',
    isSuccess: 'success'
  }
}));

export default useBase('/coupon', router.handler)