import plotly.graph_objects as go

# 创建数据
x_data = [1, 2, 3, 4, 5]
y_data = [1, 4, 9, 16, 25]

# 创建折线图
fig = go.Figure(data=go.Scatter(x=x_data, y=y_data, mode='lines'))

# 显示图形
fig.show()