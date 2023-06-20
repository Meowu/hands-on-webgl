'use client'

import Card from '../../components/Card'
import LightedCube from './LightedCube'
import LightedCube_animation from './LightedCube_animation'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={LightedCube.name}>
                <LightedCube />
            </Card>
            <Card name={LightedCube_animation.name}>
                <LightedCube_animation />
            </Card>
            {/* <Card name={HelloPoint2.name}>
                <HelloPoint2 />
            </Card> */}
            {/* <Card name={ClickedPoints.name}>
                <ClickedPoints />
            </Card> */}
            {/* <Card name={ColoredPoints.name}>
                <ColoredPoints />
            </Card> */}
        </div>
    </div>
}