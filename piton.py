import pygame
import random

# Inicialização do Pygame
pygame.init()

# Configurações da tela
WIDTH, HEIGHT = 400, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Flap Berd")

# Cores
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Variáveis do jogo
clock = pygame.time.Clock()
gravity = 0.5
bird_y = HEIGHT // 2
bird_x = 50
bird_velocity = 0

# Função para desenhar o pássaro
def draw_bird(y):
    pygame.draw.circle(screen, BLUE, (bird_x, int(y)), 15)

# Função para criar tubos
def create_pipe():
    height = random.randint(100, 400)
    return pygame.Rect(WIDTH, 0, 50, height), pygame.Rect(WIDTH, height + 150, 50, HEIGHT - height - 150)

# Lista de tubos
pipes = [create_pipe()]

# Loop principal do jogo
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            bird_velocity = -10

    # Atualiza a posição do pássaro
    bird_velocity += gravity
    bird_y += bird_velocity

    # Atualiza a posição dos tubos
    for pipe in pipes:
        pipe[0].x -= 5  # Move o tubo da esquerda para a direita
        pipe[1].x -= 5

    # Adiciona novos tubos
    if pipes[-1][0].x < WIDTH - 200:
        pipes.append(create_pipe())

    # Remove tubos que saíram da tela
    if pipes[0][0].x < -50:
        pipes.pop(0)

    # Desenha tudo na tela
    screen.fill(WHITE)
    draw_bird(bird_y)

    for pipe in pipes:
        pygame.draw.rect(screen, GREEN, pipe[0])  # Tubo de cima
        pygame.draw.rect(screen, GREEN, pipe[1])  # Tubo de baixo

    pygame.display.flip()
    clock.tick(60)

pygame.quit()