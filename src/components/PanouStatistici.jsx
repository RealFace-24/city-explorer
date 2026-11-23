import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
    const [prag, setPrag] = useState('3')
    const [tara, setTara] = useState('')
    const [statistici, setStatistici] = useState(null)
    const [eroare, setEroare] = useState(null)

    useEffect(() => {
        const pragNumeric = Number(prag)
        if (!Number.isInteger(pragNumeric) || pragNumeric < 1) {
            return
        }

        async function incarca() {
            try {
                setEroare(null)
                const date = await getStatistici(pragNumeric, tara.trim())
                setStatistici(date)
            } catch (err) {
                setEroare(err.message)
            }
        }

        incarca()
    }, [prag, tara])

    if (eroare) {
        return <p className="stare eroare">Statistici indisponibile: {eroare}</p>
    }

    return (
        <section className="panou">
            <h2>Statistici</h2>
            <label>
                Cel puțin{' '}
                <input
                    type="number"
                    value={prag}
                    onChange={(e) => setPrag(e.target.value)}
                />{' '}
                zile
            </label>{' '}
            <label>
                Țară{' '}
                <input
                    type="text"
                    placeholder="toate"
                    value={tara}
                    onChange={(e) => setTara(e.target.value)}
                />
            </label>

            {statistici && (
                <ul>
                    <li>Destinații: {statistici.destinatii}</li>
                    <li>Total zile: {statistici.zile}</li>
                    <li>Media: {statistici.medie} zile</li>
                </ul>
            )}
        </section>
    )
}