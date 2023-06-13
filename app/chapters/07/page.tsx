'use client'

import Card from '../../components/Card'
import LookAtTriangles from './LookAtTriangles'
import LookAtRotatedTriangles from './LookAtRotatedTriangles'
import LookAtRotatedTriangles_mvMatrix from './LookAtRotatedTriangles_mvMatrix'
import LookAtTrianglesWithKeys from './LookAtTrianglesWithKeys'
import OrthoView from './OrthoView'
import LookAtTrianglesWithKeys_ViewVolume from './LookAtTrianglesWithKeys_ViewVolume'
import PerspectiveView from './PerspectiveView'
import PerspectiveView_mvp from './PerspectiveView_mvp'
import PerspectiveView_mvpMatrix from './PerspectiveView_mvpMatrix'
import DepthBuffer from './DepthBuffer'

export default function Chapter07() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={LookAtTriangles.name}>
                <LookAtTriangles />
            </Card>
            <Card name={LookAtRotatedTriangles.name}>
                <LookAtRotatedTriangles />
            </Card>
            <Card name={LookAtRotatedTriangles_mvMatrix.name}>
                <LookAtRotatedTriangles_mvMatrix />
            </Card>
            <Card name={LookAtTrianglesWithKeys.name}>
                <LookAtTrianglesWithKeys />
            </Card>
            <Card name={OrthoView.name}>
                <OrthoView />
            </Card>
            <Card name={LookAtTrianglesWithKeys_ViewVolume.name}>
              <LookAtTrianglesWithKeys_ViewVolume />
            </Card>
            <Card name={PerspectiveView.name}>
              <PerspectiveView />
            </Card>
            <Card name={PerspectiveView_mvp.name}>
              <PerspectiveView_mvp />
            </Card>
            <Card name={PerspectiveView_mvpMatrix.name}>
              <PerspectiveView_mvpMatrix />
            </Card>
            <Card name={DepthBuffer.name}>
              <DepthBuffer />
            </Card>
        </div>
    </div>
}