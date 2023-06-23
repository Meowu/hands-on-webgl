'use client'

import Card from '../../components/Card'
import LightedCube from './LightedCube'
import LightedCube_animation from './LightedCube_animation'
import LightedCube_ambient from './LightedCube_ambient'
import LightedTranslatedRotatedCube from './LightedTranslatedRotatedCube'
import PointLightedCube from './PointLightedCube'
import PointLightedCube_animation from './PointLightedCube_animation'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={LightedCube.name}>
                <LightedCube />
            </Card>
            <Card name={LightedCube_animation.name}>
                <LightedCube_animation />
            </Card>
            <Card name={LightedCube_ambient.name}>
                <LightedCube_ambient />
            </Card>
            <Card name={LightedTranslatedRotatedCube.name}>
                <LightedTranslatedRotatedCube />
            </Card>
            <Card name={PointLightedCube.name}>
                <PointLightedCube />
            </Card>
            <Card name={PointLightedCube_animation.name}>
                <PointLightedCube_animation />
            </Card>
        </div>
    </div>
}