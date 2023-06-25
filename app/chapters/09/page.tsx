'use client'

import Card from '../../components/Card'
import JointModel from './JointModel'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={JointModel.name}>
                <JointModel />
            </Card>
            {/* <Card name={MultiAttributeSize_Interleaved.name}>
                <MultiAttributeSize_Interleaved />
            </Card> */}
            {/* <Card name={MultiAttributeColor.name}>
                <MultiAttributeColor />
            </Card> */}
            {/* <Card name={TexturedQuad.name}>
                <TexturedQuad />
            </Card> */}
            {/* <Card name={MultiTexture.name}>
                <MultiTexture />
            </Card> */}
        </div>
    </div>
}