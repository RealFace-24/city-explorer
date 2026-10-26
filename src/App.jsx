import { useState } from 'react';
import { destinatii as destinatiiInitiale } from './data/destinatii.js';
import {
    getNevizitate,
    totalZile,
    marcheazaVizitat,
    adaugaDestinatie,
    stergeDestinatie
} from './utils/destinatii.js';

import Rezumat from './components/Rezumat.jsx';
import ListaDestinatii from './components/ListaDestinatii.jsx';
import FormularDestinatie from './components/FormularDestinatie.jsx';
import './App.css';

export default function App() {
    const [destinatii, setDestinatii] = useState(destinatiiInitiale);

    const nevizitateArray = getNevizitate(destinatii);
    const totalNevizitate = nevizitateArray.length;
    const zileDeVizitat = totalZile(nevizitateArray);

    function handleToggle(id) {
        setDestinatii((curent) => marcheazaVizitat(curent, id));
    }

    function handleAdd(nouaDestinatie) {
        setDestinatii((curent) => adaugaDestinatie(curent, nouaDestinatie));
    }


    function handleDelete(id) {
        setDestinatii((curent) => stergeDestinatie(curent, id));
    }

    return (
        <main>
            <h1>City Explorer</h1>
            <Rezumat
                total={destinatii.length}
                nevizitate={totalNevizitate}
                zile={zileDeVizitat}
            />
            <FormularDestinatie onAdd={handleAdd} />

            <ListaDestinatii
                destinatii={destinatii}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />
        </main>
    );
}