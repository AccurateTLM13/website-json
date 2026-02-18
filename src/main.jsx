import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PromptArchitect from '../website-json-generator.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PromptArchitect />
    </StrictMode>,
)
