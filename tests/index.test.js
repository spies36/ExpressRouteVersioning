const { routeVersionHandler, exportsForTesting } = require('../dist/index.js');
const { test, expect, fn } = require('@jest/globals');
const mockData = require('./mockData.js')
const mockRequest = require('./mockRequests.js')


test('Check getlatestFunctionVersion returns latest function', () => {
    //SubVersion Only
    expect(
        exportsForTesting.getLatestFunctionVersion(mockData.verionsSubOnly)
    ).toBe(mockData.fakeFunctions.v3)

    //MinorVersion Only
    expect(
        exportsForTesting.getLatestFunctionVersion(mockData.versionsMinorOnly)
    ).toBe(mockData.fakeFunctions.v3)

    //MajorVersion Only
    expect(
        exportsForTesting.getLatestFunctionVersion(mockData.versionsMajorOnly)
    ).toBe(mockData.fakeFunctions.v3)

    //AllVersions
    expect(
        exportsForTesting.getLatestFunctionVersion(mockData.versionsMajMinSub)
    ).toBe(mockData.fakeFunctions.v4)

    //NoVersion
    expect(
        exportsForTesting.getLatestFunctionVersion({})
    ).toBe(null)
});

test('pickFunctionByVersion throws with no functions or header', async () => {

    await expect(
        exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoVersion,
            mockRequest.res, mockRequest.nextFunc, {}
        )
    ).rejects.toThrow(`No function defined for ${mockRequest.requestWithNoVersion.originalUrl}`)
})

test('pickFunctionByVersion calls highest version on matching header', async () => {
    //Setup Mocks For highest version
    mockData.verionsSubOnly['0.0.2'] = jest.fn();
    mockData.versionsMinorOnly['0.3.0'] = jest.fn();
    mockData.versionsMajorOnly['3.0.0'] = jest.fn();
    mockData.versionsMajMinSub['1.1.1'] = jest.fn();

    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestSubVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.verionsSubOnly
    )
    expect(mockData.verionsSubOnly['0.0.2']).toHaveBeenCalled()

    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestMinorVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMinorOnly
    )
    expect(mockData.versionsMinorOnly['0.3.0']).toHaveBeenCalled()

    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestMajorVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMajorOnly
    )
    expect(mockData.versionsMajorOnly['3.0.0']).toHaveBeenCalled()

    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestMajMinSubVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMajMinSub
    )
    expect(mockData.versionsMajMinSub['1.1.1']).toHaveBeenCalled()
})
