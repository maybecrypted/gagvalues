<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>maybecrypted's Values</title>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Comfortaa', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #e5e7eb;
            line-height: 1.6;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }

        .header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .header-title {
            font-size: 2rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 1rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards;
        }

        .nav-tabs {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 2rem;
            background: #0f0f0f;
            border-radius: 0.75rem;
            padding: 0.5rem;
            width: fit-content;
            margin: 0 auto 2rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.2s forwards;
        }

        .nav-tab {
            padding: 0.75rem 1.5rem;
            background: transparent;
            border: none;
            border-radius: 0.5rem;
            color: #9ca3af;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .nav-tab::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
            transition: left 0.5s ease;
        }

        .nav-tab:hover::before {
            left: 100%;
        }

        .nav-tab:hover {
            color: #e5e7eb;
            background: #1a1a1a;
            transform: translateY(-1px);
        }

        .nav-tab.active {
            background: #1f1f1f;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateY(-1px);
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            font-size: 0.875rem;
            color: #9ca3af;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.4s forwards;
            transition: all 0.3s ease;
        }

        .controls.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .refresh-btn {
            padding: 0.5rem 1rem;
            background: #1f1f1f;
            border: 1px solid #2d2d2d;
            border-radius: 0.5rem;
            color: #e5e7eb;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .refresh-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
        }

        .refresh-btn:hover::before {
            width: 100%;
            height: 100%;
        }

        .refresh-btn:hover {
            background: #2d2d2d;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .page {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            position: absolute;
            width: 100%;
            left: 0;
        }

        .page.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
            position: relative;
        }

        .page.fade-in {
            animation: fadeInContent 0.5s ease-out forwards;
        }

        .page.fade-out {
            animation: fadeOutContent 0.3s ease-in forwards;
        }

        .grid {
            display: grid;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stock-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .weather-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        .values-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .column {
            background: #0f0f0f;
            border: 1px solid #1f1f1f;
            border-radius: 0.75rem;
            padding: 1.5rem;
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.6s ease-out forwards;
        }

        .column:nth-child(1) { animation-delay: 0.1s; }
        .column:nth-child(2) { animation-delay: 0.2s; }
        .column:nth-child(3) { animation-delay: 0.3s; }
        .column:nth-child(4) { animation-delay: 0.4s; }

        .column-header {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #1f1f1f;
            padding-bottom: 1rem;
        }

        .column-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.25rem;
        }

        .column-subtitle {
            font-size: 0.75rem;
            color: #6b7280;
            display: none;
        }

        .column-count {
            font-size: 0.875rem;
            color: #9ca3af;
            margin-top: 0.5rem;
        }

        .items {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            max-height: 60vh;
            overflow-y: auto;
        }

        .items::-webkit-scrollbar {
            width: 6px;
        }

        .items::-webkit-scrollbar-track {
            background: #0f0f0f;
        }

        .items::-webkit-scrollbar-thumb {
            background: #2d2d2d;
            border-radius: 3px;
        }

        .item {
            display: flex;
            align-items: center;
            padding: 0.875rem;
            background: #151515;
            border: 1px solid #1f1f1f;
            border-radius: 0.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateX(-20px);
            animation: slideInLeft 0.4s ease-out forwards;
        }

        .item:nth-child(1) { animation-delay: 0.1s; }
        .item:nth-child(2) { animation-delay: 0.15s; }
        .item:nth-child(3) { animation-delay: 0.2s; }
        .item:nth-child(4) { animation-delay: 0.25s; }
        .item:nth-child(5) { animation-delay: 0.3s; }
        .item:nth-child(n+6) { animation-delay: 0.35s; }

        .item:hover {
            background: #1a1a1a;
            border-color: #2d2d2d;
            transform: translateX(0) translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .item-icon {
            width: 2rem;
            height: 2rem;
            border-radius: 0.375rem;
            background: transparent;
            margin-right: 0.75rem;
            flex-shrink: 0;
            object-fit: contain;
            transition: transform 0.3s ease;
        }

        .item:hover .item-icon {
            transform: scale(1.1);
        }

        .item-details {
            flex: 1;
            min-width: 0;
        }

        .item-name {
            font-weight: 500;
            color: #ffffff;
            font-size: 0.875rem;
            margin-bottom: 0.125rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .item-quantity {
            font-size: 0.75rem;
            color: #9ca3af;
        }

        .value-card {
            background: #0f0f0f;
            border: 1px solid #1f1f1f;
            border-radius: 0.75rem;
            padding: 1.25rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            animation: cardFadeIn 0.5s ease-out forwards;
        }

        .value-card:nth-child(1) { animation-delay: 0.1s; }
        .value-card:nth-child(2) { animation-delay: 0.15s; }
        .value-card:nth-child(3) { animation-delay: 0.2s; }
        .value-card:nth-child(4) { animation-delay: 0.25s; }
        .value-card:nth-child(5) { animation-delay: 0.3s; }
        .value-card:nth-child(6) { animation-delay: 0.35s; }
        .value-card:nth-child(n+7) { animation-delay: 0.4s; }

        .value-card:hover {
            background: #151515;
            border-color: #2d2d2d;
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0,0,0,0.4);
        }

        .value-image-container {
            width: 100%;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            background: transparent;
            position: relative;
            overflow: hidden;
        }

        .value-image {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: all 0.3s ease;
        }

        .value-card:hover .value-image {
            transform: scale(1.05);
        }

        .value-image.loading {
            opacity: 0;
        }

        .value-image.loaded {
            opacity: 1;
        }

        .image-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #6b7280;
            font-size: 0.75rem;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .image-placeholder.hidden {
            opacity: 0;
        }

        .value-name {
            font-size: 1rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.75rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .value-info {
            font-size: 0.75rem;
            color: #9ca3af;
            margin-bottom: 1rem;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .value-stats {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .value-stat {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            align-items: center;
        }

        .stat-label {
            color: #6b7280;
            flex-shrink: 0;
        }

        .stat-value {
            color: #e5e7eb;
            font-weight: 500;
            text-align: right;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .image-id {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.625rem;
            background: #151515;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            color: #9ca3af;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
        }

        .error {
            text-align: center;
            padding: 2rem;
            background: #1a1a1a;
            border: 1px solid #2d2d2d;
            border-radius: 0.75rem;
            color: #ef4444;
        }

        .empty {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
            font-style: italic;
        }

        /* Weather specific styles */
        .weather-item.active {
            background: #0a1a0a;
            border-color: #1a2d1a;
        }

        .weather-status {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            font-weight: 500;
        }

        .weather-active {
            color: #10b981;
        }

        .weather-inactive {
            color: #6b7280;
        }

        .weather-duration {
            font-size: 0.75rem;
            color: #9ca3af;
            margin-top: 0.125rem;
        }

        /* Demand colors */
        .demand-very-high { color: #ef4444; font-weight: 600; }
        .demand-high { color: #f97316; font-weight: 500; }
        .demand-medium { color: #eab308; }
        .demand-low { color: #22c55e; }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInContent {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOutContent {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes cardFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .loading {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Page transition wrapper */
        .page-container {
            position: relative;
            min-height: 400px;
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 1rem 0.5rem;
            }

            .header-title {
                font-size: 1.5rem;
            }

            .nav-tabs {
                flex-direction: column;
                gap: 0.25rem;
            }

            .nav-tab {
                padding: 0.5rem 1rem;
            }

            .controls {
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="header-title">maybecrypted's Values</h1>

            <div class="nav-tabs">
                <button class="nav-tab active" onclick="switchPage('stocks')">Stock Dashboard</button>
                <button class="nav-tab" onclick="switchPage('values')">Value List</button>
                <button class="nav-tab" onclick="switchPage('weather')">Weather</button>
            </div>
            
            <div class="controls" id="controls">
                <span id="last-updated">Loading...</span>
                <button class="refresh-btn" onclick="refresh()">Refresh</button>
            </div>
        </div>

        <div class="page-container">
            <!-- Stock Dashboard Page -->
            <div class="page active" id="stocks-page">
                <div class="grid stock-grid">
                    <div class="column">
                        <div class="column-header">
                            <div class="column-title">Seed Stock</div>
                            <div class="column-count" id="seed-count">0 items</div>
                        </div>
                        <div class="items" id="seed-items">
                            <div class="loading">Loading seed stock...</div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="column-header">
                            <div class="column-title">Gear Stock</div>
                            <div class="column-count" id="gear-count">0 items</div>
                        </div>
                        <div class="items" id="gear-items">
                            <div class="loading">Loading gear stock...</div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="column-header">
                            <div class="column-title">Egg Stock</div>
                            <div class="column-count" id="egg-count">0 items</div>
                        </div>
                        <div class="items" id="egg-items">
                            <div class="loading">Loading egg stock...</div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="column-header">
                            <div class="column-title">Cosmetic Stock</div>
                            <div class="column-count" id="cosmetic-count">0 items</div>
                        </div>
                        <div class="items" id="cosmetic-items">
                            <div class="loading">Loading cosmetic stock...</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Values Page -->
            <div class="page" id="values-page">
                <div class="grid values-grid" id="values-content">
                    <div class="loading">Loading values...</div>
                </div>
            </div>

            <!-- Weather Page -->
            <div class="page" id="weather-page">
                <div class="grid weather-grid">
                    <div class="column">
                        <div class="column-header">
                            <div class="column-title">Active Weather</div>
                            <div class="column-subtitle">Currently happening</div>
                            <div class="column-count" id="active-weather-count">0 events</div>
                        </div>
                        <div class="items" id="active-weather-items">
                            <div class="loading">Loading active weather...</div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="column-header">
                            <div class="column-title">Weather Events</div>
                            <div class="column-subtitle">All weather conditions</div>
                            <div class="column-count" id="all-weather-count">0 events</div>
                        </div>
                        <div class="items" id="all-weather-items">
                            <div class="loading">Loading weather events...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Enhanced tab switching with smooth animations
        let isTransitioning = false;

        function switchPage(pageId) {
            if (isTransitioning) return;
            
            isTransitioning = true;
            
            // Update active tab
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Get current and target pages
            const currentPage = document.querySelector('.page.active');
            const targetPage = document.getElementById(pageId + '-page');
            
            if (currentPage === targetPage) {
                isTransitioning = false;
                return;
            }
            
            // Fade out current page
            currentPage.classList.add('fade-out');
            
            setTimeout(() => {
                // Hide current page and show target page
                currentPage.classList.remove('active', 'fade-out');
                targetPage.classList.add('active', 'fade-in');
                
                // Reset animations for new content
                resetPageAnimations(targetPage);
                
                setTimeout(() => {
                    targetPage.classList.remove('fade-in');
                    isTransitioning = false;
                }, 400);
            }, 300);
        }

        function resetPageAnimations(page) {
            // Reset column animations
            const columns = page.querySelectorAll('.column');
            columns.forEach((column, index) => {
                column.style.animation = 'none';
                column.offsetHeight; // Trigger reflow
                column.style.animation = `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s forwards`;
            });

            // Reset item animations
            const items = page.querySelectorAll('.item');
            items.forEach((item, index) => {
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = `slideInLeft 0.4s ease-out ${0.1 + (index * 0.05)}s forwards`;
            });

            // Reset value card animations
            const cards = page.querySelectorAll('.value-card');
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `cardFadeIn 0.5s ease-out ${0.1 + (index * 0.05)}s forwards`;
            });
        }

        // Enhanced refresh function with loading animation
        function refresh() {
            const refreshBtn = document.querySelector('.refresh-btn');
            const originalText = refreshBtn.textContent;
            
            refreshBtn.textContent = 'Refreshing...';
            refreshBtn.style.opacity = '0.6';
            refreshBtn.style.pointerEvents = 'none';
            
            // Simulate refresh (replace with actual refresh logic)
            setTimeout(() => {
                refreshBtn.textContent = originalText;
                refreshBtn.style.opacity = '1';
                refreshBtn.style.pointerEvents = 'all';
                
                // Update last updated timestamp
                document.getElementById('last-updated').textContent = 'Last updated: ' + new Date().toLocaleTimeString();
            }, 1500);
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            // Set initial last updated time
            document.getElementById('last-updated').textContent = 'Last updated: ' + new Date().toLocaleTimeString();
            
            // Add stagger animation to initial elements
            const initialItems = document.querySelectorAll('#stocks-page .item');
            initialItems.forEach((item, index) => {
                item.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            });
        });

        // Add subtle parallax effect on scroll
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.header-title');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });
    </script>
    <script src="stock.js"></script>
</body>
</html>
