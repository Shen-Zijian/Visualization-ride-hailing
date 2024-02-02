import folium

# 香港的经纬度
hong_kong_coordinates = (22.3193, 114.1694)

# 创建地图对象，设置初始位置和缩放级别
map_hk = folium.Map(location=hong_kong_coordinates, zoom_start=11,)

# 保存地图到html文件
map_hk.save('hong_kong_dark_map.html')