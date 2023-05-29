'use client'

import Card from '../../components/Card'
import HelloCanvas from './HelloCanvas'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card><HelloCanvas /></Card>
        </div>
    </div>
}