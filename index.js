require('dotenv').config()
require('winston-daily-rotate-file');

const express = require('express')
const app = express()
const port = process.env.PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const winston = require('winston');
const expressWinston = require('express-winston');
const { json } = require('body-parser');

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

app.post('/conversa', async (req, res) => {
    const { handle_hashed, started_at } = req.body;

    if (!handle_hashed) {
        res.status(400);
        return res.json({
            error: 'param_missing',
            param_missing: 'handle_hashed'
        });
    }

    if (!started_at) {
        res.status(400);
        return res.json({
            error: 'param_missing',
            param_missing: 'started_at'
        });
    }

    const conversa = await knex('conversa')
        .insert({
            handle_hashed: handle_hashed,
            started_at: started_at
        }, 'id');

    res.status(201);
    return res.json({ id: conversa[0] });
});

app.post('/analytics', async (req, res) => {
    const { conversa_id, step_code, last_step_code, tag_code, first_msg_tz, finished, questionnaire_id, json_version_code } = req.body;
    console.log(req.body);
    let step_code_row = await knex('step_code').select('id').where({
        code: step_code,
        json_version_code: json_version_code
    }).first();

    let step_code_id;
    if (!step_code_row) {
        step_code_row = await knex('step_code').insert({
            questionnaire_id: questionnaire_id || undefined,
            code: step_code,
            json_version_code: json_version_code
        }, 'id');

        step_code_id = step_code_row[0];
    }
    else {
        step_code_id = step_code_row.id;
    }

    let last_step_code_id;
    if (last_step_code) {
        let last_step_code_row = await knex('step_code').select('id').where({
            code: last_step_code,
            json_version_code: json_version_code
        }).first();

        if (!last_step_code_row) {
            last_step_code_row = await knex('step_code').insert({
                questionnaire_id: questionnaire_id || undefined,
                code: last_step_code,
                json_version_code: json_version_code
            }, 'id');

            last_step_code_id = last_step_code_row[0];
        }
        else {
            last_step_code_id = last_step_code_row.id;
        }
    }

    const analytics = await knex('analytics').insert({
        conversa_id: conversa_id,
        step_code_id: step_code_id,
        previous_step_code_id: last_step_code_id,
        first_msg_tz: first_msg_tz,
        finished: finished
    }, 'id');

    res.status(200);
    res.json({ id: analytics[0] })
});


app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
})