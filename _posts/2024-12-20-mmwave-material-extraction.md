---
layout: distill
title: Building Differentiable Simulators for mmWave Radar Signals
description: This tutorial provides a step-by-step approach to building differentiable simulations for mmWave radar signals, enabling the extraction of material properties from RF measurements in 3D scenes.
date: 2024-01-01
featured: false
tags: machine-learning rf-engineering neural-fields ray-tracing
giscus_comments: false

tikzjax: true
chart:
  chartjs: true
  echarts: true
  vega_lite: true
mermaid:
  enabled: true
  zoomable: true

authors:
  - name: Richeek
    affiliations:
      name: University of Pennsylvania

bibliography: 2024-neural-rf.bib

toc:
  - name: Why This Guide?
  - name: Introduction
  - name: Problem Formulation
    subsections:
      - name: The Big Questions
      - name: Task Definitions
  - name: System Architecture
    subsections:
      - name: Hardware Components
      - name: Synchronization Protocol
  - name: Signal Simulation Physics
    subsections:
      - name: Intermediate Frequency Component
      - name: Fresnel Reflection Coefficient
      - name: Evolution of Attenuation Models
      - name: Antenna Gain Pattern
  - name: Optimizing Material Properties
    subsections:
      - name: Neural Parameterization
      - name: Training Objectives
  - name: Future Directions
    subsections:
      - name: Simultaneous Geometry and Material Learning
      - name: Dynamic Scene Modeling
      - name: Multi-Frequency Analysis
  - name: Conclusion
  - name: Acknowledgments

_styles: >
  aside {
    float: right;
    width: 30%;
    max-width: 350px;
    min-width: 250px;
    margin: 0 0 20px 20px;
    padding: 15px;
    background: #f8f9fa;
    border-left: 4px solid #007acc;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.4;
    clear: right;
  }
  aside p {
    margin: 0;
  }
  details {
    margin: 15px 0;
  }
  details > *:not(summary) {
    margin-top: 10px;
  }
  .equation-box {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 15px;
    margin: 15px 0;
  }
  .physics-insight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
  }
  .model-1 {
    margin: 25px 0;
  }
  .model-2 {
    margin: 25px 0;
  }
  .model-3 {
    margin: 25px 0;
  }
  .model-title {
    color: #333;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
  .model-1 .model-title {
    color: #2e7d32;
  }
  .model-2 .model-title {
    color: #f57c00;
  }
  .model-3 .model-title {
    color: #1976d2;
  }
  .model-badge {
    background: white;
    color: #333;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    margin-right: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .model-1 .model-badge {
    background: #4caf50;
    color: white;
  }
  .model-2 .model-badge {
    background: #ff9800;
    color: white;
  }
  .model-3 .model-badge {
    background: #2196f3;
    color: white;
  }
  .hardware-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }
  .hw-component {
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    min-width: 150px;
  }
  .hw-component:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .hw-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 15px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    font-weight: bold;
  }
  .radar-icon { background: linear-gradient(45deg, #ff6b6b, #ee5a52); }
  .lidar-icon { background: linear-gradient(45deg, #4ecdc4, #44a08d); }
  .camera-icon { background: linear-gradient(45deg, #45b7d1, #2196f3); }
  .processor-icon { background: linear-gradient(45deg, #96ceb4, #8bc34a); }
  .data-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }
  .flow-step {
    background: white;
    border-radius: 25px;
    padding: 10px 20px;
    font-weight: bold;
    color: #333;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .flow-arrow {
    font-size: 20px;
    color: #666;
  }
  .network-architecture {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 15px;
    padding: 30px;
    margin: 30px 0;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }
  .network-flow {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 30px;
    flex-wrap: wrap;
  }
  .input-section, .network-section, .output-section {
    flex: 1;
    min-width: 200px;
  }
  .section-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    font-size: 16px;
  }
  .input-item, .output-item {
    background: #f8f9fa;
    border-left: 4px solid #2196f3;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 0 8px 8px 0;
    font-size: 14px;
  }
  .output-item {
    border-left-color: #4caf50;
  }
  .network-core {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    padding: 40px 20px;
    border-radius: 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 200px;
  }
  .network-arrows {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #666;
    margin: 0 15px;
  }
  .tech-specs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin: 30px 0;
  }
  .spec-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .spec-card h5 {
    color: #2196f3;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 10px;
  }
  .spec-grid {
    display: grid;
    gap: 15px;
  }
  .spec-item {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 10px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f8f9fa;
  }
  .spec-item:last-child {
    border-bottom: none;
  }
  .spec-label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }
  .spec-value {
    color: #666;
    font-size: 14px;
  }
---

## Why This Guide?

I worked on something related to this during my time in [WAVES Lab @ UPenn](https://waves.seas.upenn.edu/). I thought it would be interesting to share a practical guide on how to build such differentiable simulations for mmWave radar signals. We will walk through the entire process of buiilding a differentiable ray tracing simulation for mmWave radar signals, including: modeling the radar signal generator, antenna gain patterns and the physics of signal propagation and reflection.

**The practical demonstration of this differentiable simulation** We will see all of this from the perspective of building an end-to-end deep learning system that can learn material properties like permittivity and permeability from actual radar measurements and 3D scene geometry. This isn't just theoretical --- it's a working system that combines a Texas Instruments mmWave radar, iPad LiDAR, and custom synchronization hardware to collect and use ground-truth data from real environments.

Whether you're interested in autonomous sensing, non-destructive material testing, or pushing the boundaries of neural scene representations, this guide provides the foundation you need to build sophisticated RF simulation systems that can learn from and predict electromagnetic interactions in complex 3D environments.

**If you find this tutorial useful for your research or projects, please consider citing it:**

{% details **📖 BibTeX**%}
```bibtex
@article{richeek2024mmwave,
  title={Building Differentiable Simulators for mmWave Radar Signals},
  author={Richeek Das},
  journal={Personal Blog},
  year={2024},
  url={https://www.seas.upenn.edu/~richeek/blog/2024/mmwave-material-extraction/}
}
```
{% enddetails %}


## Introduction

Imagine walking around with a hand-held device that emits radio frequencies and captures the material properties of the objects around you—all without infringing on privacy or requiring any physical contact. Sounds cool, right?

This is totally feasible with millimeter-wave (mmWave) radar technology that operates in the 30-300 GHz spectrum. If one goes beyond the single reflection ray tracing model in traditional NeRFs, one could hope to extract certain material properties like albedo and roughness even using standard RGB cameras (this has been done in NeRV). Similarly, if we manage to correctly model the complex multipath reflections and scattering effects of radio frequency signals, we can potentially extract material properties like permittivity and permeability.

<aside>
  <p>Radio waves can penetrate surfaces, reflect with material-dependent coefficients, and scatter according to electromagnetic properties invisible to optical sensors. This creates opportunities for non-contact material characterization.</p>
</aside>


Radio frequency signals exhibit unique interaction patterns with different materials:
- **Metallic surfaces** show strong specular reflection with minimal penetration
- **Dielectric materials** allow some penetration with frequency-dependent behavior  
- **Lossy materials** attenuate signals significantly based on their electromagnetic properties

Our goal is to reverse-engineer these material properties from observed RF signals in precisely known 3D scenes.
<div class="l-body">
  <figure>
    <img src="{{ '/assets/img/mmwave_blog/radar.png' | relative_url }}" alt="Data Collection System">
    <figcaption style="text-align: center;">
      <strong>Figure 1:</strong> Our data collection system combines a TI AWR1843 mmWave radar, iPad Pro with LiDAR, and Jetson Nano for synchronized RF and 3D data acquisition.
    </figcaption>
  </figure>
</div>

## Problem Formulation

Here we are introducing the end goal, which in turn motivates why we need to build a differentiable simulation of mmWave radar signals.

### The Big Questions

We address two fundamental research questions that bridge RF engineering and computer vision:

**Question 1:** Given RF signals $S(t)$ and precise 3D acquisition locations, can we optimize for material properties $\mathbf{M}_i$ of each surface element $i$ in the scene?

**Question 2:** Can material-optimized scenes enable novel-view synthesis for RF signals? That is, can learned material parameters $\mathbf{M}_i$ accurately predict signals at unseen locations?

### Task Definitions

We formulate two distinct problem settings with different levels of prior knowledge:

| **Known Variables** | **Variables to Estimate** |
|:---|:---|
| **Task 1:** RF Signals, Trajectory, Explicit 3D Scene | Material properties, Antenna gain pattern |
| **Task 2:** RF Signals, Trajectory only | 3D scene representation, Material properties, Antenna gain pattern |

<d-footnote>In this work, we focus exclusively on Task 1, where 3D scene geometry is known through LiDAR sensing. Task 2 represents future work requiring to learn the geometry and material properties simultaneously.</d-footnote>

## System Architecture

### Hardware Components

Our data acquisition system as introduced in Figure 1 integrates three synchronized components operating at different temporal resolutions:

<div class="system-architecture">
  <div class="hardware-grid">
    <div class="hw-component">
      <div class="hw-icon radar-icon">📡</div>
      <h4>TI AWR1843 mmWave</h4>
      <p><strong>2000 Hz</strong><br/>77-81 GHz<br/>2TX, 4RX</p>
    </div>
    
    <div class="hw-component">
      <div class="hw-icon lidar-icon">📱</div>
      <h4>iPad Pro LiDAR</h4>
      <p><strong>60 Hz</strong><br/>3D Reconstruction<br/>ARKit 6-DOF</p>
    </div>
    
    <div class="hw-component">
      <div class="hw-icon camera-icon">📷</div>
      <h4>RGB Camera</h4>
      <p><strong>60 Hz</strong><br/>Visual Capture<br/>Segmentation</p>
    </div>
    
    <div class="hw-component">
      <div class="hw-icon processor-icon">🖥️</div>
      <h4>Jetson Nano</h4>
      <p><strong>Processing Hub</strong><br/>Synchronization<br/>Data Fusion</p>
    </div>
  </div>
</div>

### Synchronization Protocol

Precise temporal alignment between RF measurements and 3D poses is critical for learning accurate material properties. Our synchronization architecture implements a hierarchical timing protocol:

**Primary Time Reference:** The Jetson Nano synchronizes with `time.apple.com` using NTP to establish a consistent time base across all components.

**RF Data Synchronization:** The TI AWR1843 radar timestamps are directly synchronized with the Jetson Nano's system clock, ensuring nanosecond-level precision for the high-frequency 2kHz radar stream.

**iPad Data Synchronization:** Each iPad RGB frame and corresponding LiDAR depth measurement includes absolute UNIX timestamps (based on `time.apple.com`)  logged during capture. These timestamps enable post-processing alignment with the radar data stream.

The overall synchronization error is maintained below **10 milliseconds**, which is sufficient for our material learning objectives given the relatively slow trajectories and stable nature of static scenes during data collection.

This temporal precision ensures that each radar measurement can be accurately associated with its corresponding RGB images and LiDAR depth data, enabling reliable data for solving the inverse problem of material property estimation.

<div class="l-body">
  <figure>
    <img src="{{ '/assets/img/mmwave_blog/3dscene.png' | relative_url }}" alt="3D Scene Reconstruction with Trajectory">
    <figcaption style="text-align: center;">
      <strong>Figure 2:</strong> Example 3D scene reconstruction using iPad RGB and LiDAR data. The reconstructed environment shows detailed geometric structure of the indoor scene.
    </figcaption>
  </figure>
</div>

## Signal Simulation Physics

For a scene discretized into triangular mesh elements, our simulated RF signal $$S_{\text{sim}}$$ at a given radar pose is computed by aggregating contributions from all visible triangles $i \in \mathcal{V}$:

<div class="equation-box">
$$S_{\text{sim}} = \sum_{i \in \mathcal{V}} \text{IF}_i(d_i) A_i G(\theta_i, \phi_i)^2 F(\zeta_i, \textbf{M}_i) M_{\text{atten}}(\zeta_i, \textbf{M}_i)$$
</div>

where each term captures distinct physical effects:

- $\text{IF}_i$: Intermediate frequency component representing emitted power, ADC timing, phase relationships, and free space power loss
- $G(\theta_i, \phi_i)^2$: Squared antenna gain pattern (combining TX and RX effects) 
- $F(\zeta_i, \textbf{M}_i)$: Fresnel reflection coefficient representing the ratio of reflected to total power
- $M_{\text{atten}}(\zeta_i, \textbf{M}_i)$: Material-dependent attenuation model, capturing the required material scattering/absorption behavior

{% details **Parameters:** %}

| Parameter | Description |
|:---|:---|
| $d_i$ | Round-trip distance to triangle $i$ |
| $A_i$ | Area of triangle $i$ |
| $\theta_i, \phi_i$ | Spherical coordinates of triangle $i$ in radar frame |
| $\zeta_i$ | Incident angle between radar ray and triangle normal |
| $\textbf{M}_i$ | Material properties of triangle $i$ (e.g., permittivity, permeability, roughness, scattering coefficients) |

{% enddetails %}

### Intermediate Frequency Component $\text{IF}_i(d_i)$

The IF signal models the fundamental radar equation incorporating the transmitted amplitude, ADC (Analog-to-Digital Converter) sampling characteristics, and free space power loss. The $1/d_i^2$ term models the free space power loss due to the spherical spreading of electromagnetic waves. For each triangle $i$, the IF component is given by:

$$\text{IF}_i(d_i) = \frac{\text{EmitterAmp}}{d_i^2} \cdot \exp\left(j4\pi \frac{d_i}{c} f_s(\text{ADC}_s + [0, \ldots, \text{ADC}_n-1]/\text{ADC}_{sr})\right)$$

{% details **Parameters:** %}

| Parameter | Description |
|:---|:---|
| $\text{EmitterAmp}$ | Radar transmitter amplitude |
| $d_i$ | Round-trip distance to triangle $i$ |
| $f_s$ | Operating frequency (77-81 GHz) |
| $c$ | Speed of light (3×10⁸ m/s) |
| $\text{ADC}_s$ | ADC start time (0μs) |
| $\text{ADC}_n$ | Number of samples (256) |
| $\text{ADC}_{sr}$ | Sampling rate (5120 ksps) |

{% enddetails %}

The exponential term captures phase shifts due to propagation delays over the complete ADC sampling window, accounting for the chirp characteristics of FMCW radar operation.


### Fresnel Reflection Coefficient $F(\zeta_i, \textbf{M}_i)$

Electromagnetic boundary conditions at material interfaces are governed by Fresnel theory. The reflection coefficient $F(\zeta_i, \textbf{M}_i)$ represents **the ratio of reflected power to total incident power** (reflected + transmitted), assuming no magnetic materials in the environment. This is a function of the incident angle $\zeta_i$ and the complex relative permittivity $\eta_i$ of the material. This $\eta_i$ is part of the material properties $\textbf{M}_i$ that we want to learn.

For non-magnetic materials, the reflection coefficients for different polarizations are:

**Perpendicular and Parallel Polarizations:**

$$r_\perp = \frac{\cos(\zeta_i) - \sqrt{\eta_i - \sin^2(\zeta_i)}}{\cos(\zeta_i) + \sqrt{\eta_i - \sin^2(\zeta_i)}} \quad \text{and} \quad r_\parallel = \frac{\eta_i \cos(\zeta_i) - \sqrt{\eta_i - \sin^2(\zeta_i)}}{\eta_i \cos(\zeta_i) + \sqrt{\eta_i - \sin^2(\zeta_i)}}$$

**Total Reflected Power Ratio:**

$$F(\zeta_i, \textbf{M}_i) = |r_\perp|^2 + |r_\parallel|^2$$

We compute $r_\perp^2 + r_\parallel^2$ as the reflected power with respect to the total power = 1.


### Evolution of Attenuation Models $M_{\text{atten}}(\zeta_i, \textbf{M}_i)$

We introduce three progressively sophisticated models for material-dependent signal attenuation:

<div class="model-1">
  <div class="model-title">
    <span class="model-badge">Model 1</span> Lambertian Scattering (Cosine Law)
  </div>
</div>

  The simplest approach uses Lambert's cosine law:
  
  $$M_{\text{atten}} = \cos(\zeta_{i,i})$$

  **Advantages:** Computationally efficient, physically motivated for diffuse reflection  
  **Limitations:** No material-dependent parameters, insufficient for modeling specular vs. diffuse materials

<div class="model-2">
  <div class="model-title">
    <span class="model-badge">Model 2</span> Backscattering Lobe Formulation
  </div>
</div>

  A more sophisticated model considering both incident and specular scattering lobes:

  $$M_{\text{atten}}(\zeta_i, \textbf{M}_i) = F_{\alpha_R,\alpha_I}(\zeta_{i,i})^{-1} \left[\Lambda \left(\frac{1 + \cos \zeta_{i,r,s}}{2}\right)^{\alpha_R} + (1-\Lambda) \left(\frac{1 - \cos\zeta_{i,i,s}}{2}\right)^{\alpha_I}\right]$$

  where the normalization factor $F_{\alpha,\beta}(\theta_i)$ is computed as a weighted sum:

  $$F_{\alpha,\beta}(\theta_i)^{-1} = \Lambda F_\alpha(\theta_i) + (1-\Lambda) F_\beta(\theta_i)$$

  with the individual normalization factors computed using series expansions:

  $$F_\alpha(\theta_i) = \frac{1}{2^\alpha} \sum_{k=0}^{\alpha} C_k^\alpha I_k$$

  The integral terms $I_k$ are defined by cases:

  $$I_k = \begin{cases}
  \frac{2\pi}{k+1} & \text{if } k \text{ is even} \\
  \frac{2\pi}{k+1} \cos \theta_i \sum_{w=0}^{(k-1)/2} C_w^{2w} \frac{\sin^{2w} \theta_i}{2^{2w}} & \text{if } k \text{ is odd}
  \end{cases}$$

  **Angle Definitions:**
  - $\zeta_{i,i}$: Incident angle (angle between incident direction and surface normal)
  - $\zeta_{i,r,s}$: Angle between specular reflection direction and scattered direction  
  - $\zeta_{i,i,s}$: Angle between incident direction and scattered direction

  **Physical Parameters modeling $\textbf{M}_i$:** (we want to learn these)
  - $\alpha_I$: Controls the size of the scattering lobe along the incident direction
  - $\alpha_R$: Controls the size of the scattering lobe along the specular direction  
  - $\Lambda$: Controls the ratio of energy distributed between the specular and incident lobes


<div class="model-3">
  <div class="model-title">
    <span class="model-badge">Model 3</span> Gaussian Proxy Optimized Model for Backscattering
  </div>
</div>

  Since we get sufficient expressive power from the previous backscattering lobe formulation, we try to alleviate the computational and memory cost problems. We design a similar attenuation response as a summation of 2 Gaussians:

  $$M_{\text{atten}}(\zeta_i, \textbf{M}_i) = \frac{1}{\sigma_i\sqrt{2\pi}} \exp \left( -\frac{\zeta_i^2}{\sqrt{2\pi}\Lambda_i\sigma_i^2} \right) + \frac{1}{\sigma_r\sqrt{2\pi}} \exp \left( -\frac{(\zeta_i - \pi/2)^2}{\sqrt{2\pi}\Lambda_r\sigma_r^2} \right)$$

  **Parameter Interpretation and Effects:** The parameters provide intuitive control over material scattering behavior. Increasing $\sigma_i$ and $\sigma_r$ increases the overall attenuation of the material by broadening the Gaussian lobes and distributing energy over wider angular ranges. For reflectance control, lowering $\Lambda_i$ increases the drop in reflectance around 0° (normal incidence), while lowering $\Lambda_r$ increases the drop in reflectance around 90° (grazing angles). Peak reflectance is controlled by the width parameters: lower $\sigma_i$ means higher reflectance around 0° (sharper normal reflection), and lower $\sigma_r$ means higher reflectance around 90° (sharper grazing reflection).

<div class="l-body">
  <figure>
    <img src="{{ '/assets/img/mmwave_blog/attenuation_backscatter1.png' | relative_url }}" alt="Attenuation Pattern 1" style="width: 48%; display: inline-block;">
    <img src="{{ '/assets/img/mmwave_blog/attenuation_backscatter2.png' | relative_url }}" alt="Attenuation Pattern 2" style="width: 48%; display: inline-block; margin-left: 2%;">
    <img src="{{ '/assets/img/mmwave_blog/attenuation_backscatter3.png' | relative_url }}" alt="Attenuation Pattern 3" style="width: 48%; display: inline-block; margin-top: 10px;">
    <img src="{{ '/assets/img/mmwave_blog/attenuation_backscatter4.png' | relative_url }}" alt="Attenuation Pattern 4" style="width: 48%; display: inline-block; margin-left: 2%; margin-top: 10px;">
    <figcaption>
      <strong>Figure 5:</strong> Gaussian proxy attenuation patterns showing the effect of different parameter configurations on material scattering behavior. Each plot demonstrates how varying $\sigma_i$, $\sigma_r$, $\Lambda_i$, and $\Lambda_r$ parameters control the angular response characteristics, enabling differentiation between specular (metallic) and diffuse (dielectric) materials.
    </figcaption>
  </figure>
</div>

**Advantages:**
- **Computational Efficiency:** Direct evaluation without normalization factor computation or series expansions
- **Differentiable:** All parameters are continuously differentiable, enabling stable gradient-based optimization
- **Intuitive Parameters:** Each parameter has clear physical interpretation and independent control over different aspects of material behavior


### Antenna Gain Pattern $G(\theta_i, \phi_i)$

Real antennas exhibit directional radiation patterns that significantly affect received signal strength. The TI AWR1843BOOST radar antenna gain pattern is accurately modeled using a close replica based on parameterized sinc functions that separately account for both H-field (horizontal) and E-field (vertical) polarizations as provided in the TI documentation.

As an approximatation, we model the antenna gain pattern $G(\theta_i, \phi_i)$ as a fixed, non-learnable function parameterized by elevation angle $\theta_i$ and azimuth angle $\phi_i$ relative to the radar plane. Our antenna gain pattern (AGP) formulation in dB scale is:

<div class="equation-box">
$$AGP(\theta_i, \phi_i) = 20 \left( \frac{\sin(3\pi \sin \theta_i)}{3\pi \sin \theta_i} + \frac{\sin(\pi \sin \phi_i)}{\pi \sin \phi_i} \right) - 30$$
</div>

<div class="l-body">
  <figure>
    <img src="{{ '/assets/img/mmwave_blog/approx_agp1.png' | relative_url }}" alt="Approximate H-plane gain pattern" style="width: 48%; display: inline-block;">
    <img src="{{ '/assets/img/mmwave_blog/ti_agp1.png' | relative_url }}" alt="TI H-plane gain pattern" style="width: 48%; display: inline-block; margin-left: 2%;">
    <img src="{{ '/assets/img/mmwave_blog/approx_agp2.png' | relative_url }}" alt="Approximate E-plane gain pattern" style="width: 48%; display: inline-block; margin-top: 10px;">
    <img src="{{ '/assets/img/mmwave_blog/ti_agp2.png' | relative_url }}" alt="TI E-plane gain pattern" style="width: 48%; display: inline-block; margin-left: 2%; margin-top: 10px;">
    <figcaption>
      <strong>Figure 6:</strong> Antenna gain pattern comparison between our approximation and TI specifications. Top row: H-plane patterns showing horizontal radiation characteristics. Bottom row: E-plane patterns demonstrating vertical radiation characteristics. The close agreement validates our sinc-based antenna model.
    </figcaption>
  </figure>
</div>

**Physical Interpretation:** This formulation captures the directional characteristics of the AWR1843BOOST antenna array:

- **Elevation Pattern ($\theta_i$ term):** The $\frac{\sin(3\pi \sin \theta_i)}{3\pi \sin \theta_i}$ term models the elevation beamwidth with a 3π scaling factor that creates the characteristic main lobe and sidelobe structure observed in the TI specifications.

- **Azimuth Pattern ($\phi_i$ term):** The $\frac{\sin(\pi \sin \phi_i)}{\pi \sin \phi_i}$ term represents the azimuthal directivity with π scaling, providing the lateral beam shaping.

- **Baseline Attenuation:** The -30 dB offset establishes the reference gain level consistent with the manufacturer's specifications.

**Spatial visualization of antenna gain pattern** contributions across a real scene. The relative signal contributions from different scene points are solely based on the antenna gain pattern, without accounting for Fresnel reflection coefficients or the scattering effects.

<div class="l-body">
  <figure>
    <img src="{{ '/assets/img/mmwave_blog/agp_contributions.png' | relative_url }}" alt="Antenna Gain Pattern Contributions">
    <figcaption style="text-align: center;">
      <strong>Figure 7:</strong> Red regions indicate higher antenna gain contributions while blue regions indicate lower contributions, clearly demonstrating the directional characteristics of our modeled AWR1843 radar antenna.
    </figcaption>
  </figure>
</div>


## Optimizing Material Properties

Finally, we arrive at the core objective of our system: learning material properties from observed RF signals!

We aim to learn the material properties $$\textbf{M}_i$$ for each triangle $i$ in the scene. In our simulated signal formulation, the only unknowns are: the complex permittivity $\eta_i$, scattering parameters $\sigma_{i,i}$ (for incident direction) and $\sigma_{i,r}$ (for specular direction), and amplitude coefficients $\Lambda_i$ (sharpness of attenuation decay) for each mesh triangle. We design an optimization framework that takes the location of the centroids, normals, colors, and segmentation information for each of the triangles as input and outputs the aforementioned material parameters.


### Neural Parameterization of $\textbf{M}_i$

**Input Feature Engineering:** Our material network processes four key input features through learned embeddings:

| Feature Type | Embedding Method | Dimensions | Purpose |
|:------------------|:-----------------|:-----------|:--------|
| **Centroid** | Sinusoidal with 10 frequency bands | 3 $\to$ 63 | Captures spatial locality to learn spatially-coherent material assignments |
| **Normal** | Sinusoidal with 4 frequency bands | 3 $\to$ 27 | Enables understanding of geometric orientation effects on electromagnetic scattering |
| **Color** | Sinusoidal with 4 frequency bands | 3 $\to$ 27 | Leverages correlation between visual and electromagnetic properties |
| **Segmentation** | Learnable embeddings | N $\to$ 32 | Maps object categories to material property priors |


**Sinusoidal Embedding Implementation:**

```python
class FrequencyEmbedder:
    def __init__(self, multires, input_dims=3):
        self.freq_bands = 2. ** torch.linspace(0., multires-1, multires)
        self.input_dims = input_dims

    def embed(self, inputs):
        outputs = [inputs]  # Include original input
        for freq in self.freq_bands:
            for fn in [torch.sin, torch.cos]:
                outputs.append(fn(inputs * freq))
        return torch.cat(outputs, -1)

centroid_embedder = FrequencyEmbedder(multires=10, input_dims=3)  # Centroids
normal_embedder = FrequencyEmbedder(multires=4, input_dims=3)  # Normals
color_embedder = FrequencyEmbedder(multires=4, input_dims=3)  # RGB colors
```

**Learnable Embedding Implementation:**

```python
class LearnableEmbedder(nn.Embedding):
    def __init__(self, num_embeddings, embedding_dim=30):
        super(LearnableEmbedder, self).__init__(num_embeddings, embedding_dim)
```


**Network Architecture:** The core material network is implemented as a multi-layer perceptron with 8 layers and 256 hidden units, using ReLU activations throughout. The final layer outputs 128-dimensional features that are then mapped to specific material parameters through dedicated learnable linear prediction heads.


**Material Parameter Outputs:** Four specialized output layers predict the material parameters $\textbf{M}_i$:

1. **Scattering Parameters:**  $\sigma_i$ and $\sigma_r$ are predicted using exponential activation on the clamped output: `exp(clamp(output, max=5.0)) + 1/√(2π)`. This ensures positive values while preventing numerical instability during training.

1. **Amplitude Weighting:** $\Lambda_i$ uses sigmoid activation to constrain values between 0 and 1, controlling the balance between incident and specular scattering lobes.

1. **Permittivity:** Permittivity $\eta_i$ is predicted using absolute value activation with an offset: `|output| + 1.0`. This ensures physically meaningful permittivity values ($\geq$ 1.0) for all materials.


This parameterization enables end-to-end gradient-based optimization while maintaining physical consistency through carefully designed activation functions and parameter constraints. The material properties produced by the network are used to calculate the material attenuation $$M_{\text{atten}}(\zeta_i, \textbf{M}_i)$$ and Fresnel reflection coefficient $$F(\zeta_i, \textbf{M}_i)$$ for each triangle in the scene. These are then combined with the intermediate frequency component $$\text{IF}_i(d_i)$$ and antenna gain pattern $$G(\theta_i, \phi_i)$$ to compute the final simulated signal $$S_{\text{sim}}$$. This forms the forward pass of our differentiable radar signal simulator.


### Training Objectives

We optimize the material model to match the magnitude of the FFTs of the simulated and ground truth signals. The error in trajectory tracking and 3D mesh creation is large enough to destroy any useful phase information present in the simulated signal, motivating our amplitude-only optimization approach.

Our training uses a combination of two complementary loss functions to match the spectral characteristics of the simulated $S_{\text{sim}}$ and ground truth $S_{\text{gt}}$ radar signals:

**1. Jensen-Shannon Divergence Loss** - Ensures the distribution of power matches between signals:

$$\mathcal{L}_{\text{JS}} = \text{JS}_{\text{Div}}\left(\frac{|\text{FFT}(S_{\text{sim}})|^2}{\sum |\text{FFT}(S_{\text{sim}})|^2}, \frac{|\text{FFT}(S_{\text{gt}})|^2}{\sum |\text{FFT}(S_{\text{gt}})|^2}\right)$$

**2. Smooth L1 Loss** - Ensures the total power matches between signals:

$$\mathcal{L}_{\text{L1}} = \text{SmoothL1}\left(\sum |\text{FFT}(S_{\text{sim}})|^2, \sum |\text{FFT}(S_{\text{gt}})|^2\right)$$

**Combined Objective:**

$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{JS}} + \mathcal{L}_{\text{L1}}$$

This approach ensures both the spectral distribution and total energy content of our simulated signals match the ground truth measurements.


#### Why Amplitude-Only Learning?

Phase information in radar signals is extremely sensitive to position accuracy. At 77 GHz ($\lambda$ = 4mm), centimeter-level trajectory errors completely scramble phase relationships: This motivates our amplitude-only optimization approach using FFT magnitudes.

#### Why Objective in Frequency Domain?

The chirp signals that we capture in real data is often sparse in the time domain, with only a few peaks corresponding to strong reflectors. Optimization in this domain leads to unstable gradients and poor convergence. The frequency domain representation is much smoother and more amenable to gradient-based optimization -- hence our choice of FFT-based loss functions.


#### Physical Intuition for Material Signatures

Different materials exhibit characteristic electromagnetic signatures that our model learns to recognize:

| Material Type | Permittivity $\eta_i$ | Scattering $\sigma_i$ | Reflectance Pattern |
|:---|:---:|:---:|:---|
| **Metal** | High | Small | Sharp specular reflection |
| **Plastic** | Medium | Medium | Mixed specular/diffuse |
| **Wood** | Low-Medium | Large | Primarily diffuse |
| **Concrete** | High | Large | Strong attenuation |


**Okay! We have covered a lot of ground.** We have built a complete differentiable simulation of mmWave radar signals that incorporates the physics of electromagnetic propagation, reflection, and antenna characteristics. We have also designed a neural network architecture to learn material properties from observed RF signals using amplitude-only loss functions. We have now reached the point where we can train this entire system end-to-end using real data and observe fun material properties emerge!


## Future Directions

### Simultaneous Geometry and Material Learning

The next goal involves **Task 2**: learning both 3D scene geometry and material properties simultaneously from RF signals alone:

$$\{\mathbf{Geometry}, \{\textbf{M}_i\}\} = \arg\min_{\mathbf{G}, \textbf{M}} \sum \mathcal{L}(S_{\text{gt}}, S_{\text{sim}}(\mathbf{G}, \textbf{M}))$$

This would eliminate the dependence on the availability of ground truth 3D scenes, enabling RF-only scene understanding.


### Dynamic Scene Modeling

Extensions to handle temporal variations:
- Moving objects with time-varying visibility
- Dynamic material properties (moisture content, temperature effects)
- Multi-agent scenarios with mobile transmitters and receivers

### Multi-Frequency Analysis

Current work operates within the 77-81 GHz band. Broadband analysis could provide:

<d-footnote>Different frequencies penetrate materials to different depths, providing complementary information about subsurface properties.</d-footnote>

- Frequency-dependent material characterization
- Enhanced material discrimination capabilities  
- Penetration depth estimation for layered materials

## Conclusion

Neural Reflectance Fields for RF signals represent a powerful convergence of electromagnetic theory, 3D computer vision, and machine learning. By carefully modeling the physics of RF propagation—from Fresnel equations to antenna radiation patterns—and using neural networks to learn material properties, we extract rich electromagnetic information from radar observations.

Key insights from this work include:

**Physics-Informed Design:** Incorporating electromagnetic theory into neural architectures improves both convergence and generalization compared to black-box approaches.

**Amplitude-Only Learning:** When phase information is unreliable due to positioning errors, amplitude-based loss functions effectively capture material signatures.

**Computational Efficiency:** Preprocessing visibility and geometric properties enables real-time simulation during training, making the approach scalable to large scenes.

This methodology opens new possibilities for non-contact material analysis and could fundamentally change how we understand electromagnetic interactions in complex 3D environments. The fusion of RF sensing with neural scene representations promises applications ranging from autonomous navigation to architectural analysis and beyond.

---

### Acknowledgments

We thank the teams behind MultiScan for 3D reconstruction capabilities and the open-source community for various computational tools that made this work possible.