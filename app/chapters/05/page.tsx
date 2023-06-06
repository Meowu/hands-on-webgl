'use client'

import Card from '../../components/Card'
import MultiAttributeSize from './MultiAttributeSize'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={MultiAttributeSize.name}>
                <MultiAttributeSize />
            </Card>
            {/* <Card name={HelloTriangle.name}>
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
            <Card name={RotatedTriangle.name}>
              <RotatedTriangle />
            </Card>
            <Card name={RotatedTriangle_Matrix.name}>
                <RotatedTriangle_Matrix />
            </Card>
            <Card name={RotatedTriangle_Matrix4.name}>
                <RotatedTriangle_Matrix4 />
            </Card>
            <Card name={RotatedTranslatedTriangle.name}>
                <RotatedTranslatedTriangle />
            </Card>
            <Card name={RotatingTriangle.name}>
                <RotatingTriangle />
            </Card> */}
        </div>
    </div>
}