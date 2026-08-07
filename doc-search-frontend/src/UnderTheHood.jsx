function UnderTheHood() {
    const pipelineSteps = [
        { name: 'Extract', desc: 'Pull raw text from uploaded PDF/DOCX files (pypdf, python-docx).' },
        { name: 'Clean', desc: 'Strip repeated boilerplate before it pollutes the embeddings.' },
        { name: 'Chunk', desc: 'Split on paragraph boundaries, not raw word counts \u2014 avoids cutting sentences mid-thought.' },
        { name: 'Embed', desc: 'Convert each chunk into a 384-dim vector (fastembed, ONNX runtime, CPU-only).' },
        { name: 'Store', desc: 'Persist embeddings and text in a local vector DB (Chroma).' },
        { name: 'Retrieve', desc: 'Embed the query, return the closest chunks by cosine distance, and highlight the best-matching sentence within each.' },
        { name: 'Generate', desc: 'Optionally: feed the top-k retrieved chunks to an LLM (Llama 3.1 via Groq) to synthesize a grounded, cited answer instead of raw passages.' },
    ];

    const stack = ['FastAPI', 'fastembed (ONNX)', 'ChromaDB', 'Groq (Llama 3.1)', 'pypdf', 'python-docx', 'React', 'Docker'];

    return (
        <div className="tech-page">
            <div className="tech-header">
                <span className="version-badge">v1.1</span>
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
                        <strong>Embedding distance measures topical similarity, not guaranteed relevance.</strong> A keyword-dense but generic chunk can still occasionally outrank a chunk that specifically answers the query.
                    </li>
                    <li>
                        <strong>The embedding model is English-centric.</strong> Mixed-language documents retrieve less precisely than English-only ones.
                    </li>
                    <li>
                        <strong>No per-user accounts.</strong> Every uploaded document is visible to every search \u2014 there's no concept of "your documents" vs. someone else's yet.
                    </li>
                    <li>
                        <strong>Generated answers are only as grounded as the retrieved context.</strong> If retrieval misses the relevant chunk, the AI Answer mode can only work with what it was given \u2014 it's instructed not to fall back on its own knowledge, but that instruction isn't a hard guarantee.
                    </li>
                </ul>
            </section>

            <section className="tech-section">
                <h2 className="tech-section-title">Planned for v2</h2>
                <ul className="limitations-list">
                    <li>
                        <strong>User accounts</strong> \u2014 scope uploaded documents and search results per logged-in user, reusing the JWT auth pattern from an earlier project.
                    </li>
                    <li>
                        <strong>Cross-encoder reranking</strong> over the top-k candidates \u2014 deprioritized for now, since a second model adds real memory pressure on free-tier hosting; revisiting once memory headroom allows.
                    </li>
                    <li>
                        <strong>Further chunking refinement</strong> for short, multi-topic reference documents, where several unrelated sections can still land in one chunk.
                    </li>
                </ul>
            </section>



            <a href="https://github.com/ZEUS1802/DocSearch"
                target="_blank"
                rel="noopener noreferrer"
                className="repo-link">
                View the code on GitHub
            </a>
        </div >
    );
}

export default UnderTheHood;