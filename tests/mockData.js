function v1() { }
function v2() { }
function v3() { }
function v4() { }

const fakeFunctions = {
    v1,
    v2,
    v3,
    v4
}

const versionsMajMinSub = {
    '0.0.0': v1,
    '0.1.0': v2,
    '1.0.0': v3,
    '1.1.1': v4
}

const verionsSubOnly = {
    '0.0.0': v1,
    '0.0.1': v2,
    '0.0.2': v3,
}

const versionsMinorOnly = {
    '0.0.0': v1,
    '0.2.0': v2,
    '0.3.0': v3,
}

const versionsMajorOnly = {
    '0.0.0': v1,
    '2.0.0': v2,
    '3.0.0': v3,
}

module.exports = {
    versionsMajMinSub,
    verionsSubOnly,
    versionsMajorOnly,
    versionsMinorOnly,
    fakeFunctions

}