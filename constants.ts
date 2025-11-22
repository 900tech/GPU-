import { GpuStage, PipelineStep } from './types';

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: GpuStage.IDLE,
    title: "系统空闲",
    description: "GPU 正在等待指令。CPU 正在处理后台操作系统任务。",
    technicalDetails: "GPU 利用率: 0% | VRAM: 静态"
  },
  {
    id: GpuStage.CPU_SEND,
    title: "1. 绘制调用 (Draw Call)",
    description: "CPU 准备几何数据和指令，并通过 PCIe 总线将其发送给 GPU。",
    technicalDetails: "API 调用 (DirectX/Vulkan/OpenGL) -> 驱动程序 -> PCIe 总线带宽使用"
  },
  {
    id: GpuStage.MEMORY_LOAD,
    title: "2. VRAM 分配",
    description: "数据到达 GPU 的高速显存 (VRAM)。这是纹理和几何数据的暂存区。",
    technicalDetails: "GDDR6X 内存 | 高带宽 (~1 TB/s)"
  },
  {
    id: GpuStage.CORE_DISTRIBUTION,
    title: "3. 任务分配",
    description: "Gigathread 引擎（调度器）将任务分解为数千个微小的线程，并将其分配给流式多处理器 (SMs)。",
    technicalDetails: "Warp 调度 | SIMD (单指令多数据)"
  },
  {
    id: GpuStage.PARALLEL_PROCESSING,
    title: "4. 大规模并行处理",
    description: "成千上万个微小核心同时对不同的像素执行相同的数学运算。这就是 GPU 的超能力。",
    technicalDetails: "ALU 运算 | 顶点/像素着色器并行执行"
  },
  {
    id: GpuStage.RASTER_MERGE,
    title: "5. 光栅化与 ROP",
    description: "处理后的几何图形被转换为像素（光栅化），进行深度检查，并写入帧缓冲区。",
    technicalDetails: "光栅化操作 (ROPs) | 抗锯齿 | 深度测试"
  },
  {
    id: GpuStage.DISPLAY,
    title: "6. 扫描输出",
    description: "完成的帧从帧缓冲区发送到显示器。",
    technicalDetails: "HDMI/DisplayPort 信号 | 刷新率同步"
  }
];

export const CORE_COUNT = 16; // Visual representation of cores (4x4 grid)