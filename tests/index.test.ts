import * as mockData from './mockData';
import * as mockRequest from './mockRequests';
import { test, expect } from '@jest/globals'
import { routeVersionHandler, exportsForTesting } from '../index';

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

test('pickFunctionByVersion returns highest function with no header', async () => {
    //setup mock for highest subVersion
    mockData.verionsSubOnly['0.0.2'] = jest.fn();
    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.verionsSubOnly
    )
    expect(mockData.verionsSubOnly['0.0.2']).toHaveBeenCalled()
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

test('pickFunctionByVersion calls matching function that is not highest', async () => {
    //setup mock for middle subVersion
    mockData.verionsSubOnly['0.0.1'] = jest.fn();
    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleSubVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.verionsSubOnly
    )
    expect(mockData.verionsSubOnly['0.0.1']).toHaveBeenCalled()

    //setup mock for middle minor version
    mockData.versionsMinorOnly['0.2.0'] = jest.fn();
    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleMinorVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMinorOnly
    )
    expect(mockData.versionsMinorOnly['0.2.0']).toHaveBeenCalled()

    //setup mock for middle major version
    mockData.versionsMajorOnly['2.0.0'] = jest.fn();
    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleMajorVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMajorOnly
    )
    expect(mockData.versionsMajorOnly['2.0.0']).toHaveBeenCalled()

    //setup mock for middle MajMinSub version
    mockData.versionsMajMinSub['1.0.0'] = jest.fn();
    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleMajMinSubVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMajMinSub
    )
    expect(mockData.versionsMajMinSub['1.0.0']).toHaveBeenCalled()
})

test('pickFunctionByVersion with no exact match version', async () => {
    //setup mock for middle MajMinSub version
    mockData.versionsMajMinSub['1.0.0'] = jest.fn()
    await exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoMatchMajMinSubVersion,
        mockRequest.res, mockRequest.nextFunc, mockData.versionsMajMinSub
    )
    expect(mockData.versionsMajMinSub['1.0.0']).toHaveBeenCalled()
})

test('routeVersionHandlerMiddleware returns correct function', async () => {
    //Get the callback
    const middleWare = routeVersionHandler(mockData.versionsMajorOnly);

    //make sure the actual call works
    mockData.versionsMajorOnly['3.0.0'] = jest.fn();
    await middleWare(mockRequest.requestWithHighestMajorVersion, mockRequest.res, mockRequest.nextFunc);
    expect(mockData.versionsMajorOnly['3.0.0']).toHaveBeenCalled()
})
