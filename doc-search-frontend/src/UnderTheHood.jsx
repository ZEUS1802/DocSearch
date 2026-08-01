function UnderTheHood() {
    const pipelineSteps = [
        { name: 'Extract', desc: 'Pull raw text from uploaded PDF/DOCX files (pypdf, python-docx).' },
        { name: 'Clean', desc: 'Strip repeated boilerplate before it pollutes the embeddings.' },
        { name: 'Chunk', desc: 'Split text into overlapping word-count windows.' },
        { name: 'Embed', desc: 'Convert each chunk into a 384-dim vector (sentence-transformers).' },
        { name: 'Store', desc: 'Persist embeddings and text in a local vector DB (Chroma).' },
        { name: 'Retrieve', desc: 'Embed the query, return the closest chunks by cosine distance.' },
    ];

    const stack = ['FastAPI', 'sentence-transformers', 'ChromaDB', 'pypdf', 'python-docx', 'React', 'Docker'];

    return (
        <div className="tech-page">
            <div className="tech-header">
                <h1 className="tech-title serif">Under the hood</h1>
                <p className="tech-intro">
                    A quick look at how this actually works: the pipeline, a real problem it ran into, and what's still rough around the edges.
                </p>
            </div>

            <section className="tech-section">
                <h2 className="tech-section-title">The pipeline</h2>
                <div className="pipeline">
                    {pipelineSteps.map((step, i) => (
                        <div className="pipeline-step" key={step.name}>
                            <div className="pipeline-num">{String(i + 1).padStart(2, '0')}</div>
                            <div>
                                <div className="pipeline-name">{step.name}</div>
                                <div className="pipeline-desc">{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="tech-section">
                <h2 className="tech-section-title">Stack</h2>
                <div className="stack-tags">
                    {stack.map((t) => (
                        <span className="stack-tag" key={t}>{t}</span>
                    ))}
                </div>
            </section>

            <section className="tech-section">
                <h2 className="tech-section-title">A real finding: boilerplate was skewing results</h2>
                <p className="tech-text">
                    The source PDFs had a marketing sentence repeated after nearly every section. Since embeddings compress a whole chunk into one vector, that repeated noise diluted the actual content, so results were being ranked by keyword density in the boilerplate rather than relevance to the query.
                </p>
                <div className="finding-box">
                    <div className="finding-row">
                        <span>Before cleaning</span>
                        <span className="finding-value">top match distance 1.108</span>
                    </div>
                    <div className="finding-row">
                        <span>After stripping boilerplate</span>
                        <span className="finding-value good">top match distance 0.951</span>
                    </div>
                </div>
                <p className="tech-text">
                    Lower distance means a closer semantic match, a measurable improvement from a one-line preprocessing fix.
                </p>
            </section>

            <section className="tech-section">
                <h2 className="tech-section-title">What's still rough</h2>
                <ul className="limitations-list">
                    <li>
                        <strong>Chunk boundaries are word-count based</strong>, not semantic. A single logical entry can occasionally get split across two chunks.
                    </li>
                    <li>
                        <strong>Dense reference and citation sections</strong> in academic PDFs can outrank genuinely relevant content, since they are keyword-heavy but low in actual information.
                    </li>
                    <li>
                        <strong>The embedding model is English-centric.</strong> Mixed-language documents retrieve less precisely than English-only ones.
                    </li>
                </ul>
            </section>


            <a href="https://github.com/ZEUS1802/Throttle-v2"
                target="_blank"
                rel="noopener noreferrer"
                className="repo-link"
            >
                View the code on GitHub
            </a>
        </div >
    );
}

export default UnderTheHood;