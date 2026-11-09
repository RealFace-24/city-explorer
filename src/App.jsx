import { useState, useEffect } from 'react';
import { getNevizitate, totalZile } from './utils/destinatii.js';
import { getDestinatii, patchVizitat, postDestinatie } from './api/destinatii.js';
import ListaDestinatii from './components/ListaDestinatii.jsx';
import FormularDestinatie from './components/FormularDestinatie.jsx';
import Rezumat from './components/Rezumat.jsx';
import Cautare from './components/Cautare.jsx';
import PanouStatistici from './components/PanouStatistici.jsx';
import './App.css';

export default function App() {
    const [destinatii, setDestinatii] = useState([]);
    const [incarcare, setIncarcare] = useState(true);
    const [eroare, setEroare] = useState(null);

    const [seTrimite, setSeTrimite] = useState(false);
    const [cautare, setCautare] = useState('');

    useEffect(() => {
        async function incarca() {
            try {
                const date = await getDestinatii();
                setDestinatii(date);
            } catch (err) {
                setEroare(err.message);
            } finally {
                setIncarcare(false);
            }
        }
        incarca();
    }, []);

    async function handleToggle(id) {
        const destToUpdate = destinatii.find(d => d.id === id);
        if(!destToUpdate) return;

        try {
            const salvata = await patchVizitat(id, !destToUpdate.vizitat);
            setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)));
        } catch (err) {
            console.error('Nu am putut actualiza.', err);
        }
    }

    async function handleAdd(destinatie) {
        setSeTrimite(true);
        try {
            const salvata = await postDestinatie(destinatie);
            setDestinatii((curent) => [...curent, salvata]);
        } catch (err) {
            console.error('Eroare la adăugare', err);
        } finally {
            setSeTrimite(false);
        }
    }

    function handleDelete(id) {
        setDestinatii((curent) => curent.filter((d) => d.id !== id));
    }

    if (incarcare) {
        return <p className="stare">Se încarcă destinațiile...</p>;
    }

    if (eroare) {
        return <p className="stare eroare">A apărut o eroare: {eroare}</p>;
    }

    const nevizitate = getNevizitate(destinatii);

    const textCautat = cautare.trim().toLowerCase();
    const afisate = destinatii.filter(
        (d) =>
            d.oras.toLowerCase().includes(textCautat) ||
            d.tara.toLowerCase().includes(textCautat)
    );

    return (
        <main>
            <h1>City Explorer</h1>

            <PanouStatistici />

            <Rezumat
                total={destinatii.length}
                nevizitate={nevizitate.length}
                zile={totalZile(nevizitate)}
            />
            <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />

            <Cautare valoare={cautare} onChange={setCautare} />

            {destinatii.length === 0 ? (
                <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
            ) : afisate.length === 0 ? (
                <p className="gol">Niciun rezultat pentru „{cautare}”.</p>
            ) : (
                <ListaDestinatii destinatii={afisate} onToggle={handleToggle} onDelete={handleDelete} />
            )}
        </main>
    );
}