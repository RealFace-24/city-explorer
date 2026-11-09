import { useEffect, useState } from 'react';

export default function PanouStatistici() {
    const [destinatii, setDestinatii] = useState([]);
    const [incarcare, setIncarcare] = useState(true);
    const [eroare, setEroare] = useState(null);
    const [prag, setPrag] = useState('3');

    useEffect(() => {
        async function incarca() {
            try {
                const response = await fetch('http://localhost:3001/destinatii');
                if (!response.ok) {
                    throw new Error(`Serverul a răspuns cu ${response.status}`);
                }
                const date = await response.json();
                setDestinatii(date);
            } catch (err) {
                setEroare(err.message);
            } finally {
                // CORECTURA 5: setIncarcare(false) a fost mutat aici pentru a se executa și la eroare
                setIncarcare(false);
            }
        }
        incarca();
    }, []);

    if (incarcare) {
        return <p className="stare">Se încarcă statisticile...</p>;
    }
    if (eroare) {
        return <p className="stare eroare">Statistici indisponibile: {eroare}</p>;
    }

    // CORECTURA 3: am folosit >= în loc de > pentru a include și destinațiile egale cu pragul
    const filtrate = destinatii.filter((d) => d.zile >= Number(prag));

    // CORECTURA 1: am calculat totalul folosind "filtrate.reduce", nu "destinatii.reduce"
    const totalZile = filtrate.reduce((suma, d) => suma + d.zile, 0);
    const medie = filtrate.length === 0 ? 0 : totalZile / filtrate.length;

    return (
        <section className="panou">
            <h2>Statistici</h2>
            <label>
                Cel puțin{' '}
                <input
                    type="number"
                    value={prag}
                    // CORECTURA 4: extragem corect valoarea introdusă cu e.target.value
                    onChange={(e) => setPrag(e.target.value)}
                />{' '}
                zile
            </label>

            {filtrate.length === 0 && (
                <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
            )}

            {filtrate.length > 0 && (
                <ul>
                    <li>Destinații: {filtrate.length}</li>
                    <li>Total zile: {totalZile}</li>
                    <li>Media: {medie.toFixed(1)} zile</li>
                </ul>
            )}
        </section>
    );
}