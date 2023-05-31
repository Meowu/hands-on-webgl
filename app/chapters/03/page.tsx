'use client'

import Card from '../../components/Card'
import MultiPoint from './MultiPoint'
import HelloTriangle from './HelloTriangle'
import HelloQuad from './HelloQuad'
import HelloQuad_FAN from './HelloQuad_FAN'
import TranslatedTriangle from './TranslatedTriangle'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={MultiPoint.name}>
                <MultiPoint />
            </Card>
            <Card name={HelloTriangle.name}>
                <HelloTriangle />
            </Card>
            <Card name={HelloQuad.name}>
                <HelloQuad />
            </Card>
            <Card name={HelloQuad_FAN.name}>
                <HelloQuad_FAN />
            </Card>
            <Card name={TranslatedTriangle.name}>
                <TranslatedTriangle />
            </Card>
        </div>
    </div>
}