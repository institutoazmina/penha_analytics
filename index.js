require('dotenv').config()

const express = require('express')
const app = express()
const port = 2049;
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
});

app.get('/health-check', (req, res) => {
    res.status(200);
    res.json({ status: 'ok' });
})

app.post('/analytics', async (req, res) => {
    const { handle_hashed, conversa_id, step_code, last_step_code, tag_code, first_msg_tz } = req.body;

    let conversa = await knex('conversa').select(['id']).where({ id: conversa_id });
    if (!conversa[0]) {
        console.log('ta aqui');
        conversa = await knex('conversa')
            .insert({
                id: conversa_id,
                handle_hashed: handle_hashed,
                started_at: first_msg_tz
            }, ['id'])
            .onConflict('id')
            .ignore();
    }

    const analytics = await knex('analytics')
        .insert({
            conversa_id: conversa_id,
            step_code_id: knex('step_code').where({ code: step_code }).select('id'),
            previous_step_code_id: last_step_code ? knex('step_code').where({ code: last_step_code }).select('id') : undefined,
            first_msg_tz: first_msg_tz
        }, 'id');

    res.status(200);
    res.json({ id: analytics[0] })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})