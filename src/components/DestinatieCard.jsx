export default function DestinatieCard({ destinatie, onToggle, onDelete }) {
    const { oras, tara, zile, vizitat, id } = destinatie;

    return (
        <article className={vizitat ? 'card vizitat' : 'card'}>
            <h3>{oras}</h3>
            <p className="tara">{tara}</p>
            <p className="zile">{zile} zile</p>

            <button type="button" onClick={() => onToggle(id)}>
                {vizitat ? 'Vizitat' : 'Marchează vizitat'}
            </button>

            <button
                type="button"
                onClick={() => onDelete(id)}
                style={{ background: '#ef4444', marginTop: '0.5rem' }}
            >
                Șterge
            </button>
        </article>
    );
}