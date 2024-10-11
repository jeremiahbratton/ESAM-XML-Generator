/**
* Lets break this up a little bit to make it easier to read later...
* No complaining, modules make it easier to manage in the long run
*/

export function getSegmentPair(segment, index, aquisitionPointIdentity, offset = 2) {
  //Lets destructure out the pieces of a segment because we have some calculations to make, and its easier to read.
  const { segmentStart, segmentDuration, segmentTypeId, segmentPair } = segment;
 
  /**
   * Calculate segment offsets to keep the global count of the list correct
   */
  const startSignalId = index * offset + 1;
  const endSignalId = startSignalId + 1;
 
  //This stays the same for both parts of the pair. Pull up by one due to zero indexing
  const segmentEventId = index + 1;
 
  /**
   * nptPoints and signalPointID expect decimal values.
   */
  const segmentStartPoint = Math.floor(segmentStart).toFixed(2);
 
  //Calculate the end of the ending segment
  const segmentEnd = segmentStart + segmentDuration;
  const segmentEndPoint = Math.floor(segmentEnd).toFixed(2);
 
  //Anything running through here is assumed to need a paired Response Signal to mark its endpoint. Start and end codes in the SCTE specs are offset by one. Increase the segment Type ID by one. 
  const segmentTypeIdEnd = parseInt(segmentTypeId) + 1;

  const segment1 = `<ResponseSignal acquisitionPointIdentity="${aquisitionPointIdentity}" acquisitionSignalID="${startSignalId}" signalPointID="${segmentStartPoint}" action="create">
      <sig:NPTPoint nptPoint="${segmentStartPoint}"/>
      <sig:SCTE35PointDescriptor spliceCommandType="06">
        <sig:SegmentationDescriptorInfo segmentEventId="${segmentEventId}" segmentTypeId="${segmentTypeId}" upidType="9" upid="${startSignalId}" duration="PT${segmentDuration}S" segmentNumber="${segmentEventId}" segmentsExpected="1"/>
      </sig:SCTE35PointDescriptor>
    </ResponseSignal>
    <ConditioningInfo acquisitionSignalIDRef="1" startOffset="PT${segmentStart}S" duration="PT${segmentDuration}S"/>`;

  const segment2 = `<ResponseSignal acquisitionPointIdentity="${aquisitionPointIdentity}" acquisitionSignalID="${endSignalId}" signalPointID="${segmentEndPoint}" action="create">
      <sig:NPTPoint nptPoint="${segmentEndPoint}"/>
      <sig:SCTE35PointDescriptor spliceCommandType="06">
        <sig:SegmentationDescriptorInfo segmentEventId="${segmentEventId}" segmentTypeId="${segmentTypeIdEnd}" upidType="9" upid="${endSignalId}" />
      </sig:SCTE35PointDescriptor>
    </ResponseSignal>`;

  const fullSegment = segmentPair ? segment1 + segment2 : segment1;
 
  return fullSegment;
 }