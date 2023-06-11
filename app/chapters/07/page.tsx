'use client'

import Card from '../../components/Card'
import LookAtTriangles from './LookAtTriangles'
import LookAtRotatedTriangles from './LookAtRotatedTriangles'

export default function Chapter07() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={LookAtTriangles.name}>
                <LookAtTriangles />
            </Card>
            <Card name={LookAtRotatedTriangles.name}>
                <LookAtRotatedTriangles />
            </Card>
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