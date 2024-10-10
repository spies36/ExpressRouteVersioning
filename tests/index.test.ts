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

test('pickFunctionByVersion throws with no functions or header', () => {
    try {
        expect(
            exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoVersion, {})
        ).toThrowError();
    } catch (error: any) {
        expect(error.message).toEqual(`No function defined for ${mockRequest.requestWithNoVersion.originalUrl}`)
    }
})

test('pickFunctionByVersion returns highest function with no header', () => {
    //setup mock for highest subVersion
    mockData.verionsSubOnly['0.0.2'] = jest.fn(() => { return '0.0.2' });
    exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoVersion, mockData.verionsSubOnly)
    expect(exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoVersion, mockData.verionsSubOnly))
        .toEqual(mockData.verionsSubOnly['0.0.2'])
})

test('pickFunctionByVersion calls highest version on matching header', () => {
    //Setup Mocks For highest version
    mockData.verionsSubOnly['0.0.2'] = jest.fn(() => { return '0.0.2' });
    mockData.versionsMinorOnly['0.3.0'] = jest.fn(() => { return '0.3.0' });
    mockData.versionsMajorOnly['3.0.0'] = jest.fn(() => { return '3.0.0' });
    mockData.versionsMajMinSub['1.1.1'] = jest.fn(() => { return '1.1.1' });

    expect(exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestSubVersion, mockData.verionsSubOnly))
        .toEqual(mockData.verionsSubOnly['0.0.2'])


    expect(exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestMinorVersion, mockData.versionsMinorOnly))
        .toEqual(mockData.versionsMinorOnly['0.3.0'])

    expect(exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestMajorVersion, mockData.versionsMajorOnly))
        .toEqual(mockData.versionsMajorOnly['3.0.0'])


    expect(exportsForTesting.pickFunctionByVersion(mockRequest.requestWithHighestMajMinSubVersion, mockData.versionsMajMinSub))
        .toEqual(mockData.versionsMajMinSub['1.1.1'])
})

test('pickFunctionByVersion calls matching function that is not highest', () => {
    //setup mock for middle subVersion
    mockData.verionsSubOnly['0.0.1'] = jest.fn(() => { return '0.0.1' });
    expect(mockData.verionsSubOnly['0.0.1']).toEqual(
        exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleSubVersion, mockData.verionsSubOnly)
    )

    //setup mock for middle minor version
    mockData.versionsMinorOnly['0.2.0'] = jest.fn(() => { return '0.2.0' });
    expect(mockData.versionsMinorOnly['0.2.0']).toEqual(
        exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleMinorVersion, mockData.versionsMinorOnly)
    )

    //setup mock for middle major version
    mockData.versionsMajorOnly['2.0.0'] = jest.fn(() => { return '2.0.0' });
    expect(mockData.versionsMajorOnly['2.0.0']).toEqual(
        exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleMajorVersion, mockData.versionsMajorOnly)
    )

    //setup mock for middle MajMinSub version
    mockData.versionsMajMinSub['1.0.0'] = jest.fn(() => { return '1.0.0' });
    expect(mockData.versionsMajMinSub['1.0.0']).toEqual(
        exportsForTesting.pickFunctionByVersion(mockRequest.requestWithMiddleMajMinSubVersion, mockData.versionsMajMinSub)
    )
})

test('pickFunctionByVersion with no exact match version', () => {
    //setup mock for middle MajMinSub version
    mockData.versionsMajMinSub['1.0.0'] = jest.fn(() => { return '1.0.0' })
    expect(mockData.versionsMajMinSub['1.0.0']).toEqual(
        exportsForTesting.pickFunctionByVersion(mockRequest.requestWithNoMatchMajMinSubVersion, mockData.versionsMajMinSub)
    )
})

test('routeVersionHandlerMiddleware returns correct function', async () => {
    //Get the callback
    const middleWare = routeVersionHandler(mockData.versionsMajorOnly);

    //make sure the actual call works
    mockData.versionsMajorOnly['3.0.0'] = jest.fn(() => { return '3.0.0' });
    await middleWare(mockRequest.requestWithHighestMajorVersion, mockRequest.res, mockRequest.nextFunc);
    expect(mockData.versionsMajorOnly['3.0.0'])
})
