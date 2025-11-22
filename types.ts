export enum GpuStage {
  IDLE = 'IDLE',
  CPU_SEND = 'CPU_SEND',
  MEMORY_LOAD = 'MEMORY_LOAD',
  CORE_DISTRIBUTION = 'CORE_DISTRIBUTION',
  PARALLEL_PROCESSING = 'PARALLEL_PROCESSING',
  RASTER_MERGE = 'RASTER_MERGE',
  DISPLAY = 'DISPLAY'
}

export interface PipelineStep {
  id: GpuStage;
  title: string;
  description: string;
  technicalDetails: string;
}

export interface CoreState {
  id: number;
  isActive: boolean;
  taskColor: string;
}