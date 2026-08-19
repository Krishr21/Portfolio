(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  THREE.OBJLoader = (function () {
    // Regular expressions for parsing OBJ
    const _vA = new THREE.Vector3();
    const _vB = new THREE.Vector3();
    const _vC = new THREE.Vector3();

    const _ab = new THREE.Vector3();
    const _cb = new THREE.Vector3();

    function OBJLoader(manager) {
      this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
      this.materials = null;
    }

    OBJLoader.prototype = {
      constructor: OBJLoader,

      load: function (url, onLoad, onProgress, onError) {
        const scope = this;
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(
          url,
          function (text) {
            try {
              onLoad(scope.parse(text));
            } catch (e) {
              if (onError) {
                onError(e);
              } else {
                console.error(e);
              }
              scope.manager.itemError(url);
            }
          },
          onProgress,
          onError
        );
      },

      setPath: function (value) {
        this.path = value;
        return this;
      },

      setMaterials: function (materials) {
        this.materials = materials;
        return this;
      },

      parse: function (text) {
        const state = {
          objects: [],
          object: {},
          vertices: [],
          normals: [],
          colors: [],
          uvs: [],
          materials: {},
          materialLibraries: [],
          startObject: function (name, fromDeclaration) {
            if (this.object && this.object.fromDeclaration === false) {
              this.object.name = name;
              this.object.fromDeclaration = fromDeclaration !== false;
              return;
            }
            const previousMaterial =
              this.object && typeof this.object.currentMaterial === 'function'
                ? this.object.currentMaterial()
                : undefined;

            if (this.object && typeof this.object._finalize === 'function') {
              this.object._finalize(true);
            }

            this.object = {
              name: name || '',
              fromDeclaration: fromDeclaration !== false,
              geometry: {
                vertices: [],
                normals: [],
                colors: [],
                uvs: [],
                hasUVIndices: false
              },
              materials: [],
              smooth: true,
              startMaterial: function (name, libraries) {
                const previous = this._finalize(false);
                if (previous && (previous.inherited || previous.groupCount <= 0)) {
                  this.materials.splice(previous.index, 1);
                }
                const material = {
                  index: this.materials.length,
                  name: name || '',
                  mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : '',
                  smooth: previous !== undefined ? previous.smooth : this.smooth,
                  groupStart: previous !== undefined ? previous.groupEnd : 0,
                  groupEnd: -1,
                  groupCount: -1,
                  inherited: false,
                  clone: function (index) {
                    const cloned = {
                      index: typeof index === 'number' ? index : this.index,
                      name: this.name,
                      mtllib: this.mtllib,
                      smooth: this.smooth,
                      groupStart: 0,
                      groupEnd: -1,
                      groupCount: -1,
                      inherited: false
                    };
                    cloned.clone = this.clone.bind(cloned);
                    return cloned;
                  }
                };
                this.materials.push(material);
                return material;
              },
              currentMaterial: function () {
                if (this.materials.length > 0) {
                  return this.materials[this.materials.length - 1];
                }
                return undefined;
              },
              _finalize: function (end) {
                const lastMultiMaterial = this.currentMaterial();
                if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {
                  lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
                  lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
                  lastMultiMaterial.inherited = false;
                }
                if (end && this.materials.length > 1) {
                  for (let mi = this.materials.length - 1; mi >= 0; mi--) {
                    if (this.materials[mi].groupCount <= 0) {
                      this.materials.splice(mi, 1);
                    }
                  }
                }
                if (end && this.materials.length === 0) {
                  this.materials.push({
                    name: '',
                    smooth: this.smooth
                  });
                }
                return lastMultiMaterial;
              }
            };

            if (
              previousMaterial &&
              previousMaterial.name &&
              typeof previousMaterial.clone === 'function'
            ) {
              const declared = previousMaterial.clone(0);
              declared.inherited = true;
              this.object.materials.push(declared);
            }

            this.objects.push(this.object);
          },
          finalize: function () {
            if (this.object && typeof this.object._finalize === 'function') {
              this.object._finalize(true);
            }
          },
          parseVertexIndex: function (value, len) {
            const index = parseInt(value, 10);
            return (index >= 0 ? index - 1 : index + len / 3) * 3;
          },
          parseNormalIndex: function (value, len) {
            const index = parseInt(value, 10);
            return (index >= 0 ? index - 1 : index + len / 3) * 3;
          },
          parseUVIndex: function (value, len) {
            const index = parseInt(value, 10);
            return (index >= 0 ? index - 1 : index + len / 2) * 2;
          },
          addVertex: function (a, b, c) {
            const src = this.vertices;
            const dst = this.object.geometry.vertices;
            dst.push(src[a + 0], src[a + 1], src[a + 2]);
            dst.push(src[b + 0], src[b + 1], src[b + 2]);
            dst.push(src[c + 0], src[c + 1], src[c + 2]);
          },
          addNormal: function (a, b, c) {
            const src = this.normals;
            const dst = this.object.geometry.normals;
            dst.push(src[a + 0], src[a + 1], src[a + 2]);
            dst.push(src[b + 0], src[b + 1], src[b + 2]);
            dst.push(src[c + 0], src[c + 1], src[c + 2]);
          },
          addUV: function (a, b, c) {
            const src = this.uvs;
            const dst = this.object.geometry.uvs;
            dst.push(src[a + 0], src[a + 1]);
            dst.push(src[b + 0], src[b + 1]);
            dst.push(src[c + 0], src[c + 1]);
          },
          addFace: function (a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {
            const vLen = this.vertices.length;
            let ia = this.parseVertexIndex(a, vLen);
            let ib = this.parseVertexIndex(b, vLen);
            let ic = this.parseVertexIndex(c, vLen);
            let id;

            if (d === undefined) {
              this.addVertex(ia, ib, ic);
            } else {
              id = this.parseVertexIndex(d, vLen);
              this.addVertex(ia, ib, id);
              this.addVertex(ib, ic, id);
            }

            if (ua !== undefined && ua !== '') {
              const uvLen = this.uvs.length;
              ia = this.parseUVIndex(ua, uvLen);
              ib = this.parseUVIndex(ub, uvLen);
              ic = this.parseUVIndex(uc, uvLen);

              if (d === undefined) {
                this.addUV(ia, ib, ic);
              } else {
                id = this.parseUVIndex(ud, uvLen);
                this.addUV(ia, ib, id);
                this.addUV(ib, ic, id);
              }
              this.object.geometry.hasUVIndices = true;
            }

            if (na !== undefined && na !== '') {
              const nLen = this.normals.length;
              ia = this.parseNormalIndex(na, nLen);
              ib = this.parseNormalIndex(nb, nLen);
              ic = this.parseNormalIndex(nc, nLen);

              if (d === undefined) {
                this.addNormal(ia, ib, ic);
              } else {
                id = this.parseNormalIndex(nd, nLen);
                this.addNormal(ia, ib, id);
                this.addNormal(ib, ic, id);
              }
            }
          }
        };

        state.startObject('', false);

        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          if (line.length === 0 || line.charAt(0) === '#') continue;

          const lineFirstChar = line.charAt(0);

          if (lineFirstChar === 'v') {
            const data = line.split(/\s+/);
            switch (data[0]) {
              case 'v':
                state.vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                break;
              case 'vn':
                state.normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                break;
              case 'vt':
                state.uvs.push(parseFloat(data[1]), parseFloat(data[2]));
                break;
            }
          } else if (lineFirstChar === 'f') {
            const lineData = line.substr(1).trim();
            const vertexData = lineData.split(/\s+/);
            const faceVertices = [];

            for (let j = 0; j < vertexData.length; j++) {
              const currentVertex = vertexData[j];
              if (currentVertex.length > 0) {
                const vertexParts = currentVertex.split('/');
                faceVertices.push(vertexParts);
              }
            }

            const v1 = faceVertices[0];
            for (let j = 1; j < faceVertices.length - 1; j++) {
              const v2 = faceVertices[j];
              const v3 = faceVertices[j + 1];
              state.addFace(
                v1[0], v2[0], v3[0], undefined,
                v1[1], v2[1], v3[1], undefined,
                v1[2], v2[2], v3[2], undefined
              );
            }
          } else if (line.startsWith('usemtl ')) {
            state.object.startMaterial(line.substr(7).trim(), state.materialLibraries);
          } else if (line.startsWith('o ')) {
            state.startObject(line.substr(2).trim(), true);
          }
        }

        state.finalize();

        const container = new THREE.Group();

        for (let i = 0; i < state.objects.length; i++) {
          const object = state.objects[i];
          const geometry = object.geometry;
          const materials = object.materials;
          const isLine = geometry.type === 'Line';

          if (geometry.vertices.length === 0) continue;

          const buffergeometry = new THREE.BufferGeometry();
          buffergeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(geometry.vertices, 3)
          );

          if (geometry.normals.length > 0) {
            buffergeometry.setAttribute(
              'normal',
              new THREE.Float32BufferAttribute(geometry.normals, 3)
            );
          } else {
            buffergeometry.computeVertexNormals();
          }

          if (geometry.uvs.length > 0) {
            buffergeometry.setAttribute(
              'uv',
              new THREE.Float32BufferAttribute(geometry.uvs, 2)
            );
          }

          const createdMaterials = [];

          for (let mi = 0; mi < materials.length; mi++) {
            const sourceMaterial = materials[mi];
            let material = undefined;

            if (sourceMaterial.name !== '') {
              buffergeometry.addGroup(
                sourceMaterial.groupStart,
                sourceMaterial.groupCount,
                mi
              );
            }

            createdMaterials.push(material);
          }

          let mesh;
          if (createdMaterials.length > 1) {
            mesh = new THREE.Mesh(buffergeometry, createdMaterials);
          } else {
            mesh = new THREE.Mesh(buffergeometry, createdMaterials[0] || new THREE.MeshStandardMaterial());
          }

          mesh.name = object.name;
          container.add(mesh);
        }

        return container;
      }
    };

    return OBJLoader;
  })();
})();
