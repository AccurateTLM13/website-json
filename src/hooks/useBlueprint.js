import { useContext } from 'react';
import { BlueprintContext } from '../context/BlueprintContext';

export default function useBlueprint() {
    const context = useContext(BlueprintContext);
    if (!context) {
        throw new Error('useBlueprint must be used within a BlueprintProvider');
    }
    return context;
}
