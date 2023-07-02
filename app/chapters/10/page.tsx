'use client'

import Card from '../../components/Card'
import RoateObject from './RotateObject'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={RoateObject.name}>
                <RoateObject />
            </Card>
            {/* <Card name={MultiJointModel.name}>
                <MultiJointModel />
            </Card> */}
            {/* <Card name={MultiJointModel_segment.name}>
                <MultiJointModel_segment />
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