import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { jurnal } from './jurnal.js'
import statistici from './rute/statistici.js'
import ruteJurnal from './rute/jurnal.js'

const app = express()
const PORT = process.env.PORT || 3000

// Logger pentru terminal (necesar la fisa, punctele 3 si 5)
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl)
    next()
})

// Ex 4d: jurnal INAINTE de cors() pentru a inregistra si cererile OPTIONS
// (Pentru fisa pct. 5 randul 2, pune temporar app.use(jurnal) DUPA app.use(cors()))
app.use(jurnal)
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl)
    next()
})
app.use(cors())

app.use(express.json())

// Ex 1c: ruta temporara de ecou
app.all('/api/ecou/:id', (req, res) => {
    res.json({ params: req.params, query: req.query, body: req.body })
})

// Ex 5a: cautare exacta dupa oras (scrisa inainte de rutele cu :id)
app.get('/api/destinatii/caut', async (req, res) => {
    const oras = req.query.oras ?? ''
    const [randuri] = await pool.query(
        'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
        [oras]
    )
    res.json(randuri.map((d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })))
})

// Ex 1b: toate destinatiile
app.get('/api/destinatii', async (req, res) => {
    const [randuri] = await pool.query(
        'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id'
    )
    res.json(randuri.map((d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })))
})

// Ex 2: adaugare destinatie cu validare pe server
app.post('/api/destinatii', async (req, res) => {
    const { oras, tara, zile } = req.body

    if (
        typeof oras !== 'string' ||
        oras.trim() === '' ||
        typeof tara !== 'string' ||
        tara.trim() === '' ||
        !Number.isInteger(zile) ||
        zile < 1 ||
        zile > 30
    ) {
        return res.status(400).json({ eroare: 'Date invalide.' })
    }

    const orasCurat = oras.trim()
    const taraCurata = tara.trim()

    const [rezultat] = await pool.query(
        'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
        [orasCurat, taraCurata, zile, false]
    )

    res.status(201).json({
        id: String(rezultat.insertId),
        oras: orasCurat,
        tara: taraCurata,
        zile,
        vizitat: false,
    })
})

// Ex 3a: marcare vizitat
app.patch('/api/destinatii/:id', async (req, res) => {
    const { id } = req.params
    const { vizitat } = req.body

    if (typeof vizitat !== 'boolean') {
        return res.status(400).json({ eroare: 'Câmpul vizitat trebuie să fie boolean.' })
    }

    const [rezultat] = await pool.query(
        'UPDATE destinatii SET vizitat = ? WHERE id = ?',
        [vizitat, id]
    )

    if (rezultat.affectedRows === 0) {
        return res.status(404).json({ eroare: 'Destinația nu există.' })
    }

    const [randuri] = await pool.query(
        'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
        [id]
    )
    const d = randuri[0]
    res.json({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })
})

// Ex 3c si 4b: routere separate
app.use('/api/statistici', statistici)
app.use('/api/jurnal', ruteJurnal)

app.listen(PORT, () => {
    console.log(`API pornit pe http://localhost:${PORT}`)
})