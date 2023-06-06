'use client'

import Card from '../../components/Card'
import MultiAttributeSize from './MultiAttributeSize'
import MultiAttributeSize_Interleaved from './MultiAttributeSize_Interleaved'
import MultiAttributeColor from './MultiAttributeColor'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={MultiAttributeSize.name}>
                <MultiAttributeSize />
            </Card>
            <Card name={MultiAttributeSize_Interleaved.name}>
                <MultiAttributeSize_Interleaved />
            </Card>
            <Card name={MultiAttributeColor.name}>
                <MultiAttributeColor />
            </Card>
            {/* <Card name={HelloQuad_FAN.name}>
                <HelloQuad_FAN />
            </Card> */}
            {/* <Card name={TranslatedTriangle.name}>
                <TranslatedTriangle />
            </Card> */}
        </div>
    </div>
}